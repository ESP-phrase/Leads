'use client'

import { useEffect, useState } from 'react'
import { Check, X, ExternalLink, Copy, ChevronDown } from 'lucide-react'
import Sidebar from '@/components/Sidebar'

interface Status {
  telnyx:  { apiKey: boolean; fromNumber: boolean; a2pEnabled: boolean; numberType: string | null; webhookBase: boolean }
  resend:  { apiKey: boolean; from: boolean; adminEmail: boolean }
  stripe:  { secretKey: boolean; webhookSecret: boolean }
  reddit:  { pixelId: boolean; capiToken: boolean; testMode: boolean }
  meta:    { pixelId: boolean }
  google:  { analytics: boolean; placesApiKey: boolean }
  clarity: { projectId: boolean }
  tiktok:  { pixelId: boolean }
  openai:  { apiKey: boolean }
  vercel:  { token: boolean }
}

type Step = { label: string; copy?: string; url?: string }

interface Integration {
  id: keyof Status
  name: string
  required: boolean
  blurb: string
  signupUrl: string
  envVars: { name: string; required: boolean }[]
  steps: Step[]
  checkConfigured: (s: Status) => boolean
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'telnyx',
    name: 'Telnyx — SMS + Voice',
    required: true,
    blurb: 'Powers calling (WebRTC) + outbound SMS (10DLC or toll-free). Currently the bottleneck for automated SMS until 10DLC clears or you switch to TFN.',
    signupUrl: 'https://portal.telnyx.com',
    envVars: [
      { name: 'TELNYX_API_KEY',        required: true },
      { name: 'TELNYX_PHONE_NUMBER',   required: true },
      { name: 'TELNYX_A2P_ENABLED',    required: false },
      { name: 'TELNYX_WEBHOOK_BASE_URL', required: false },
    ],
    steps: [
      { label: 'Sign in to Telnyx Portal', url: 'https://portal.telnyx.com' },
      { label: 'Phone Numbers → Buy Numbers → filter Toll-Free (US) → buy one (~$2/mo)' },
      { label: 'Messaging → Toll-Free Verification → submit using webhustle.org as the website', url: 'https://portal.telnyx.com/#/messaging/toll-free-verification' },
      { label: 'Wait 1–3 business days for verification' },
      { label: 'Once verified, in Vercel env set:', copy: 'TELNYX_PHONE_NUMBER=+18XXXXXXXXX\nTELNYX_A2P_ENABLED=true' },
    ],
    checkConfigured: s => s.telnyx.apiKey && s.telnyx.fromNumber && s.telnyx.a2pEnabled,
  },
  {
    id: 'resend',
    name: 'Resend — Email notifications',
    required: true,
    blurb: 'Emails you when someone submits the homepage form. Free tier = 100/day, 3000/month.',
    signupUrl: 'https://resend.com/signup',
    envVars: [
      { name: 'RESEND_API_KEY', required: true },
      { name: 'ADMIN_EMAIL',    required: true },
      { name: 'RESEND_FROM',    required: false },
    ],
    steps: [
      { label: 'Sign up at resend.com (no credit card)', url: 'https://resend.com/signup' },
      { label: 'Dashboard → API Keys → Create API Key (full access)', url: 'https://resend.com/api-keys' },
      { label: 'Copy the key (starts with re_) and add to Vercel env:', copy: 'RESEND_API_KEY=re_xxxxxxxxxxxxx\nADMIN_EMAIL=aubreynicholsacc@gmail.com' },
      { label: 'Optional: verify webhustle.org domain to send from "leads@webhustle.org"', url: 'https://resend.com/domains' },
    ],
    checkConfigured: s => s.resend.apiKey && s.resend.adminEmail,
  },
  {
    id: 'stripe',
    name: 'Stripe — Take $299 payments',
    required: true,
    blurb: 'Generates a payment link per closed lead. Required for the "Bill" button to work.',
    signupUrl: 'https://dashboard.stripe.com/register',
    envVars: [
      { name: 'STRIPE_SECRET_KEY',     required: true },
      { name: 'STRIPE_WEBHOOK_SECRET', required: false },
    ],
    steps: [
      { label: 'Sign up at stripe.com', url: 'https://dashboard.stripe.com/register' },
      { label: 'Complete business profile (legal name, EIN/SSN, bank account)' },
      { label: 'Developers → API keys → reveal Secret key', url: 'https://dashboard.stripe.com/apikeys' },
      { label: 'Add to Vercel env:', copy: 'STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx' },
      { label: 'Optional: Developers → Webhooks → Add endpoint', copy: 'https://www.webhustle.org/api/stripe/webhook' },
      { label: 'Webhook events: checkout.session.completed, payment_intent.succeeded' },
      { label: 'Copy Signing Secret → add to Vercel env:', copy: 'STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxx' },
    ],
    checkConfigured: s => s.stripe.secretKey,
  },
  {
    id: 'reddit',
    name: 'Reddit Ads — Pixel + CAPI',
    required: false,
    blurb: 'Track Lead + Purchase conversions for Reddit Ads. Server-side CAPI ensures iOS/ad-blocker users still count.',
    signupUrl: 'https://ads.reddit.com',
    envVars: [
      { name: 'NEXT_PUBLIC_REDDIT_PIXEL_ID', required: true },
      { name: 'REDDIT_CAPI_TOKEN',           required: true },
      { name: 'REDDIT_CAPI_TEST_ID',         required: false },
    ],
    steps: [
      { label: 'Sign in to Reddit Ads', url: 'https://ads.reddit.com' },
      { label: 'Top-right menu → Events Manager → Create pixel → name: WebHustle' },
      { label: 'Copy Pixel ID (looks like a2_xxxxxxxx)' },
      { label: 'Events Manager → Conversions API tab → Generate token → copy' },
      { label: 'Add to Vercel env:', copy: 'NEXT_PUBLIC_REDDIT_PIXEL_ID=a2_xxxxxxxx\nREDDIT_CAPI_TOKEN=<token>' },
      { label: 'Test it:', url: '/api/test/reddit-capi' },
    ],
    checkConfigured: s => s.reddit.pixelId && s.reddit.capiToken,
  },
  {
    id: 'meta',
    name: 'Meta Pixel — Facebook/Instagram Ads',
    required: false,
    blurb: 'Track conversions for FB/IG ads. Fires PageView on every page + Lead on form submit.',
    signupUrl: 'https://business.facebook.com',
    envVars: [{ name: 'NEXT_PUBLIC_META_PIXEL_ID', required: true }],
    steps: [
      { label: 'Go to Meta Business → Events Manager', url: 'https://business.facebook.com/events_manager2' },
      { label: 'Connect data source → Web → Meta Pixel' },
      { label: 'Name: WebHustle. Skip the manual install (already wired)' },
      { label: 'Copy Pixel ID (15-16 digit number)' },
      { label: 'Add to Vercel env:', copy: 'NEXT_PUBLIC_META_PIXEL_ID=123456789012345' },
    ],
    checkConfigured: s => s.meta.pixelId,
  },
  {
    id: 'tiktok',
    name: 'TikTok Pixel — TikTok Ads',
    required: false,
    blurb: 'Currently not auto-wired in the codebase — say the word and I\'ll add the Pixel + Events API the same way Reddit is wired.',
    signupUrl: 'https://ads.tiktok.com',
    envVars: [{ name: 'NEXT_PUBLIC_TIKTOK_PIXEL_ID', required: false }],
    steps: [
      { label: 'Sign in to TikTok Ads', url: 'https://ads.tiktok.com' },
      { label: 'Tools → Events → Web events → Connect data → Manual setup' },
      { label: 'Copy Pixel ID' },
      { label: 'Add to Vercel env (placeholder — needs code wire-up):', copy: 'NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXXXXXXXXXXX' },
    ],
    checkConfigured: s => s.tiktok.pixelId,
  },
  {
    id: 'google',
    name: 'Google Analytics + Places',
    required: false,
    blurb: 'GA4 tracks page views + form conversions. Places API powers lead scraping in /leads.',
    signupUrl: 'https://analytics.google.com',
    envVars: [
      { name: 'NEXT_PUBLIC_GA_ID',       required: false },
      { name: 'GOOGLE_PLACES_API_KEY',   required: false },
    ],
    steps: [
      { label: 'Analytics: analytics.google.com → Admin → Create Property → name: WebHustle', url: 'https://analytics.google.com' },
      { label: 'Data Streams → Web → URL: https://www.webhustle.org' },
      { label: 'Copy Measurement ID (G-XXXXXXXXXX)' },
      { label: 'Add to Vercel env:', copy: 'NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX' },
      { label: 'Places API: console.cloud.google.com → enable Places API, copy key', url: 'https://console.cloud.google.com/apis/library/places-backend.googleapis.com' },
      { label: 'Add:', copy: 'GOOGLE_PLACES_API_KEY=AIzaSy...' },
    ],
    checkConfigured: s => s.google.analytics || s.google.placesApiKey,
  },
  {
    id: 'clarity',
    name: 'Microsoft Clarity — Heatmaps + Session Replays',
    required: false,
    blurb: 'Free, unlimited. Watch every visitor session like a video. Highest-ROI tool for ad optimization.',
    signupUrl: 'https://clarity.microsoft.com',
    envVars: [{ name: 'NEXT_PUBLIC_CLARITY_ID', required: true }],
    steps: [
      { label: 'Sign up at clarity.microsoft.com', url: 'https://clarity.microsoft.com' },
      { label: '+ New project → name: WebHustle → URL: https://www.webhustle.org' },
      { label: 'Settings → Setup → copy the Project ID (8-10 chars)' },
      { label: 'Add to Vercel env:', copy: 'NEXT_PUBLIC_CLARITY_ID=xxxxxxxx' },
    ],
    checkConfigured: s => s.clarity.projectId,
  },
  {
    id: 'openai',
    name: 'OpenAI — Lead enrichment + AI drafts',
    required: true,
    blurb: 'Powers "Find owner" enrichment, deep enrichment wealth scoring, and AI SMS drafts. ~$0.001 per use.',
    signupUrl: 'https://platform.openai.com/signup',
    envVars: [{ name: 'OPENAI_API_KEY', required: true }],
    steps: [
      { label: 'Sign up at platform.openai.com', url: 'https://platform.openai.com/signup' },
      { label: 'API keys → Create new secret key', url: 'https://platform.openai.com/api-keys' },
      { label: 'Add to Vercel env:', copy: 'OPENAI_API_KEY=sk-proj-xxxxxxxx' },
      { label: 'Recommend setting usage limit at $20-50/mo to start' },
    ],
    checkConfigured: s => s.openai.apiKey,
  },
]

export default function IntegrationsPage() {
  const [status, setStatus] = useState<Status | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/integrations/status').then(r => r.json()).then(setStatus).catch(() => {})
  }, [])

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  const configuredCount = status ? INTEGRATIONS.filter(i => i.checkConfigured(status)).length : 0
  const requiredMissing = status ? INTEGRATIONS.filter(i => i.required && !i.checkConfigured(status)).length : 0

  return (
    <div className="flex min-h-screen pb-20 md:pb-0" style={{ background: '#0d0e0b', color: '#d4dfc4' }}>
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2218] sticky top-0 z-10" style={{ background: '#0d0e0b' }}>
          <div>
            <h1 className="font-bold text-white text-base">Integrations</h1>
            <p className="text-xs mt-0.5" style={{ color: '#4a5a3a' }}>
              {status
                ? `${configuredCount}/${INTEGRATIONS.length} configured · ${requiredMissing} required missing`
                : 'Loading…'}
            </p>
          </div>
          <a href="https://vercel.com/dashboard"
             target="_blank"
             className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
             style={{ background: '#c8f135', color: '#0d0e0b' }}>
            Open Vercel env <ExternalLink size={14} />
          </a>
        </div>

        <div className="p-6 max-w-4xl">
          <p className="text-sm mb-6" style={{ color: '#5a6a4a', lineHeight: 1.7 }}>
            All API keys go into{' '}
            <strong style={{ color: '#d4dfc4' }}>Vercel → Project Settings → Environment Variables</strong>
            . After saving, click <strong style={{ color: '#d4dfc4' }}>Redeploy</strong> in the Deployments tab.
            Click any integration to expand setup steps.
          </p>

          <div className="space-y-2">
            {INTEGRATIONS.map(integ => {
              const isConfigured = status ? integ.checkConfigured(status) : false
              const isOpen = expanded === integ.id
              return (
                <div key={integ.id} style={{ background: '#111310', border: '1px solid #1e2218', borderRadius: 12, overflow: 'hidden' }}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : integ.id)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left transition-all"
                    style={{ background: isOpen ? '#181f12' : 'transparent' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: isConfigured ? '#c8f13520' : '#3a1515',
                      border: `1.5px solid ${isConfigured ? '#c8f135' : '#5a2020'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {isConfigured
                        ? <Check size={14} style={{ color: '#c8f135' }} />
                        : <X size={14} style={{ color: '#d45a5a' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white text-sm">{integ.name}</p>
                        {integ.required && !isConfigured && (
                          <span style={{
                            padding: '1px 7px', borderRadius: 4, fontSize: 9, fontWeight: 800,
                            background: '#3a1515', color: '#f08080', border: '1px solid #5a2020',
                          }}>
                            REQUIRED
                          </span>
                        )}
                        {!integ.required && (
                          <span style={{
                            padding: '1px 7px', borderRadius: 4, fontSize: 9, fontWeight: 800,
                            background: '#1a2238', color: '#7dafff', border: '1px solid #2a3550',
                          }}>
                            OPTIONAL
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#5a6a4a' }}>{integ.blurb}</p>
                    </div>
                    <ChevronDown size={16} style={{ color: '#5a6a4a', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s', flexShrink: 0 }} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 border-t" style={{ borderColor: '#1e2218' }}>
                      {/* Env vars */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a6a4a' }}>Env vars used</p>
                        <div className="flex flex-wrap gap-1.5">
                          {integ.envVars.map(v => {
                            // Best-effort check whether this specific env is set, based on flat keys
                            const flat = status ? (status as unknown as Record<string, Record<string, boolean>>) : null
                            const grp = flat ? flat[integ.id] : null
                            let set = false
                            if (grp) {
                              if (v.name === 'TELNYX_API_KEY')          set = !!grp.apiKey
                              else if (v.name === 'TELNYX_PHONE_NUMBER') set = !!grp.fromNumber
                              else if (v.name === 'TELNYX_A2P_ENABLED')  set = !!grp.a2pEnabled
                              else if (v.name === 'TELNYX_WEBHOOK_BASE_URL') set = !!grp.webhookBase
                              else if (v.name === 'RESEND_API_KEY')      set = !!grp.apiKey
                              else if (v.name === 'RESEND_FROM')         set = !!grp.from
                              else if (v.name === 'ADMIN_EMAIL')         set = !!grp.adminEmail
                              else if (v.name === 'STRIPE_SECRET_KEY')   set = !!grp.secretKey
                              else if (v.name === 'STRIPE_WEBHOOK_SECRET') set = !!grp.webhookSecret
                              else if (v.name === 'NEXT_PUBLIC_REDDIT_PIXEL_ID') set = !!grp.pixelId
                              else if (v.name === 'REDDIT_CAPI_TOKEN')   set = !!grp.capiToken
                              else if (v.name === 'REDDIT_CAPI_TEST_ID') set = !!grp.testMode
                              else if (v.name === 'NEXT_PUBLIC_META_PIXEL_ID')   set = !!grp.pixelId
                              else if (v.name === 'NEXT_PUBLIC_TIKTOK_PIXEL_ID') set = !!grp.pixelId
                              else if (v.name === 'NEXT_PUBLIC_GA_ID')          set = !!grp.analytics
                              else if (v.name === 'GOOGLE_PLACES_API_KEY')      set = !!grp.placesApiKey
                              else if (v.name === 'NEXT_PUBLIC_CLARITY_ID')     set = !!grp.projectId
                              else if (v.name === 'OPENAI_API_KEY')             set = !!grp.apiKey
                            }
                            return (
                              <span key={v.name} style={{
                                padding: '4px 9px', borderRadius: 6, fontSize: 11, fontFamily: 'monospace',
                                background: set ? '#0d2218' : '#1a1612',
                                color: set ? '#c8f135' : v.required ? '#d4a3a3' : '#6b7a5a',
                                border: `1px solid ${set ? '#1a3520' : v.required ? '#4a2020' : '#2a3220'}`,
                              }}>
                                {set ? '✓ ' : ''}{v.name}
                              </span>
                            )
                          })}
                        </div>
                      </div>

                      {/* Setup steps */}
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a6a4a' }}>Setup steps</p>
                      <ol className="space-y-2 mb-3">
                        {integ.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm" style={{ color: '#a0b890', lineHeight: 1.6 }}>
                            <span style={{
                              flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                              background: '#1e2218', color: '#5a6a4a', fontSize: 11, fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <span>{step.label}</span>
                              {step.url && (
                                <a href={step.url} target="_blank" rel="noopener noreferrer"
                                   className="inline-flex items-center gap-1 ml-2"
                                   style={{ color: '#c8f135', fontSize: 12 }}>
                                  open <ExternalLink size={11} />
                                </a>
                              )}
                              {step.copy && (
                                <div style={{
                                  marginTop: 6, padding: '8px 12px', borderRadius: 6,
                                  background: '#0a0b09', border: '1px solid #1e2218',
                                  fontFamily: 'monospace', fontSize: 12, color: '#c8f135',
                                  display: 'flex', alignItems: 'flex-start', gap: 8, whiteSpace: 'pre',
                                }}>
                                  <pre style={{ margin: 0, flex: 1, overflow: 'auto' }}>{step.copy}</pre>
                                  <button
                                    onClick={() => copyToClipboard(step.copy!, `${integ.id}-${i}`)}
                                    className="flex-shrink-0 transition-all"
                                    style={{ color: copied === `${integ.id}-${i}` ? '#c8f135' : '#5a6a4a', cursor: 'pointer' }}
                                    title="Copy">
                                    {copied === `${integ.id}-${i}` ? <Check size={13} /> : <Copy size={13} />}
                                  </button>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>

                      <a href={integ.signupUrl} target="_blank" rel="noopener noreferrer"
                         className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
                         style={{ background: '#c8f135', color: '#0a0b09' }}>
                        Sign in / Sign up <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
