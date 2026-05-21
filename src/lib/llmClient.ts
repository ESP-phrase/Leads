/**
 * Unified LLM client for WebHustle, routed through OpenRouter.
 *
 * Why OpenRouter:
 * - Single key/bill across every major model (OpenAI, Anthropic, Google, ...)
 * - Each call site picks the model that fits its task — not one default for
 *   all jobs. Different tasks (extract / judgment / creative / voice) reward
 *   different model profiles.
 * - Failover when an upstream provider is degraded
 * - Swap models with a one-line env change (no code edits)
 *
 * The OpenAI SDK speaks OpenRouter's `/v1/chat/completions` natively, so
 * JSON mode, tool calls, and streaming all work without code changes.
 */
import OpenAI from "openai";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

function isOpenRouter(): boolean {
  return (process.env.LLM_PROVIDER ?? "").toLowerCase() === "openrouter";
}

let cachedClient: OpenAI | null = null;
let cachedProvider: string | null = null;

/**
 * Returns a configured OpenAI SDK client pointed at the right backend.
 * Cached per-provider so repeated calls don't re-instantiate.
 */
export function getLLMClient(): OpenAI {
  const provider = isOpenRouter() ? "openrouter" : "openai";
  if (cachedClient && cachedProvider === provider) return cachedClient;

  if (provider === "openrouter") {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) {
      throw new Error(
        "OPENROUTER_API_KEY env var is required when LLM_PROVIDER=openrouter."
      );
    }
    cachedClient = new OpenAI({
      apiKey: key,
      baseURL: OPENROUTER_BASE_URL,
      defaultHeaders: {
        // OpenRouter uses these for analytics + ranking attribution.
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL ?? "https://www.webhustle.org",
        "X-Title": "WebHustle",
      },
    });
  } else {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY env var is required.");
    cachedClient = new OpenAI({ apiKey: key });
  }

  cachedProvider = provider;
  return cachedClient;
}

/**
 * On native OpenAI mode, returns the bare model ID unchanged.
 * On OpenRouter mode, namespaces unprefixed IDs with "openai/" so they
 * route back to the same provider (lets you start with OpenAI defaults
 * and swap to other vendors per-task).
 */
export function resolveModel(modelId: string): string {
  if (!isOpenRouter()) {
    // On native OpenAI mode, strip any namespace so we send "gpt-4o-mini"
    // not "openai/gpt-4o-mini". Anthropic/Google models won't work here.
    return modelId.includes("/") ? modelId.split("/").slice(1).join("/") : modelId;
  }
  return modelId.includes("/") ? modelId : `openai/${modelId}`;
}

// ─── Task-specific model selection ─────────────────────────────────────────
//
// Each constant names the JOB, not the model. That way swapping models is a
// one-line change here, and you can read each call site and immediately know
// what kind of work it's doing.
//
// Defaults reflect "best fit" today. Override any of them via env vars
// without redeploying:
//   LLM_MODEL_EXTRACT, LLM_MODEL_JUDGMENT, LLM_MODEL_WRITER, LLM_MODEL_VOICE

/** Extract structured JSON from messy text (owner info, site scrapes).
 *  Wants: long context, reliable JSON mode, instruction following.
 *  Doesn't need: reasoning, creativity, voice.
 *  Pick: gpt-4o-mini — battle-tested on extract tasks, cheap-enough, fast. */
export const MODEL_EXTRACT =
  process.env.LLM_MODEL_EXTRACT ?? "openai/gpt-4o-mini";

/** Judgment calls based on inferred signals (wealth tier from web mentions).
 *  Wants: reasoning, calibrated confidence, no hallucination.
 *  Doesn't need: long context, creativity.
 *  Pick: claude-sonnet-4.6 — drives the pricing tier ($149→$799), so the
 *  upgrade vs Haiku pays for itself if it gets even 1-in-100 calls right.
 *  Manual-trigger only — low volume, cost is negligible. */
export const MODEL_JUDGMENT =
  process.env.LLM_MODEL_JUDGMENT ?? "anthropic/claude-sonnet-4.6";

/** Customer-facing creative copy (website headlines, services, CTAs).
 *  Wants: quality, brand voice consistency, native English.
 *  Doesn't need: speed, low cost.
 *  Pick: claude-sonnet-4.6 — best-in-class for short-form persuasive writing.
 *  Customers see this output — quality matters more than the few cents saved. */
export const MODEL_WRITER =
  process.env.LLM_MODEL_WRITER ?? "anthropic/claude-sonnet-4.6";

/** Persona / voice-matching for short messages (SMS drafts in 4 tones).
 *  Wants: tone control, brevity, distinctive voice per persona.
 *  Doesn't need: reasoning, long context.
 *  Pick: claude-sonnet-4.6 — the SMS is the entire first impression of
 *  WebHustle to the lead. Tone authenticity directly drives reply rate,
 *  which drives close rate. Quality over per-token cost. */
export const MODEL_VOICE =
  process.env.LLM_MODEL_VOICE ?? "anthropic/claude-sonnet-4.6";
