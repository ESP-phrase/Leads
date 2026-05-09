import { db } from '@/lib/db'
import { generateSiteContent } from '@/lib/generator'
import { renderSiteHtml, deployToVercel } from '@/lib/vercel'

export const maxDuration = 300

// Streams progress as sites build in parallel
export async function POST(req: Request) {
  const { leadIds } = await req.json()
  if (!Array.isArray(leadIds) || leadIds.length === 0) {
    return new Response(JSON.stringify({ error: 'leadIds required' }), { status: 400 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)) } catch {}
      }

      send({ type: 'start', total: leadIds.length })

      // Build sites in parallel — limit to 4 at a time to avoid overload
      const CONCURRENCY = 4
      let completed = 0
      let succeeded = 0
      let failed = 0

      async function buildOne(leadId: string) {
        try {
          const lead = await db.lead.findUnique({ where: { id: leadId } })
          if (!lead) { send({ type: 'fail', leadId, error: 'Not found' }); failed++; return }
          if (lead.previewUrl) {
            send({ type: 'skip', leadId, name: lead.name, reason: 'already built' })
            completed++; return
          }

          send({ type: 'progress', leadId, name: lead.name, status: 'generating' })

          const content = await generateSiteContent({
            name: lead.name,
            category: lead.category ?? 'local business',
            city: lead.city ?? 'your area',
            rating: lead.rating,
            reviewCount: lead.reviewCount,
          })

          const services = typeof content.services === 'string'
            ? JSON.parse(content.services)
            : content.services

          send({ type: 'progress', leadId, name: lead.name, status: 'deploying' })

          let vercelUrl: string | null = null
          if (process.env.VERCEL_TOKEN) {
            try {
              const html = renderSiteHtml({
                businessName: lead.name,
                headline: content.headline,
                subheadline: content.subheadline,
                services,
                aboutText: content.aboutText,
                phone: lead.phone,
                address: lead.address,
                city: lead.city ?? '',
                category: lead.category ?? '',
                rating: lead.rating,
                reviewCount: lead.reviewCount,
                primaryColor: '#2563eb',
                slug: lead.slug ?? lead.id,
              })
              vercelUrl = await deployToVercel(lead.slug ?? lead.id, html)
            } catch (err) {
              send({ type: 'fail', leadId, name: lead.name, error: `Deploy: ${err}` })
              failed++; completed++; return
            }
          }

          const previewUrl = vercelUrl ?? `${process.env.PREVIEW_BASE_URL}/preview/${lead.slug}`

          await db.generatedSite.upsert({
            where: { leadId },
            create: {
              leadId,
              headline: content.headline,
              subheadline: content.subheadline,
              services: JSON.stringify(services),
              aboutText: content.aboutText,
              cityServed: lead.city ?? '',
              phone: lead.phone,
              address: lead.address,
              primaryColor: '#2563eb',
              template: 'modern',
              vercelUrl,
            },
            update: {
              headline: content.headline,
              subheadline: content.subheadline,
              services: JSON.stringify(services),
              aboutText: content.aboutText,
              cityServed: lead.city ?? '',
              phone: lead.phone,
              address: lead.address,
              vercelUrl,
            },
          })
          await db.lead.update({ where: { id: leadId }, data: { previewUrl } })

          send({ type: 'success', leadId, name: lead.name, vercelUrl, previewUrl })
          succeeded++
        } catch (err) {
          send({ type: 'fail', leadId, error: String(err) })
          failed++
        }
        completed++
      }

      // Process in batches of CONCURRENCY
      for (let i = 0; i < leadIds.length; i += CONCURRENCY) {
        const batch = leadIds.slice(i, i + CONCURRENCY)
        await Promise.all(batch.map(buildOne))
      }

      send({ type: 'done', total: leadIds.length, succeeded, failed })
      try { controller.close() } catch {}
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
