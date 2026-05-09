import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSiteContent } from '@/lib/generator'
import { renderSiteHtml, deployToVercel } from '@/lib/vercel'

export async function POST(req: Request) {
  const body = await req.json()
  const { leadId, primaryColor = '#2563eb', template = 'modern' } = body

  if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

  const lead = await db.lead.findUnique({ where: { id: leadId } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  // Step 1: Generate content via OpenAI
  let content
  try {
    content = await generateSiteContent({
      name: lead.name,
      category: lead.category ?? 'local business',
      city: lead.city ?? 'your area',
      rating: lead.rating,
      reviewCount: lead.reviewCount,
    })
  } catch (err) {
    console.error('[generate] OpenAI failed:', err)
    return NextResponse.json({ error: 'OpenAI content generation failed', detail: String(err) }, { status: 500 })
  }

  const services = typeof content.services === 'string'
    ? JSON.parse(content.services)
    : content.services

  // Step 2: Render HTML + deploy to Vercel
  let vercelUrl: string | null = null
  let deployError: string | null = null
  const localUrl = `${process.env.PREVIEW_BASE_URL}/preview/${lead.slug}`

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
        primaryColor,
        slug: lead.slug ?? lead.id,
      })
      vercelUrl = await deployToVercel(lead.slug ?? lead.id, html)
      console.log('[generate] Deployed to Vercel:', vercelUrl)
    } catch (err) {
      deployError = String(err)
      console.error('[generate] Vercel deploy failed:', err)
    }
  } else {
    deployError = 'VERCEL_TOKEN not set'
    console.warn('[generate] No VERCEL_TOKEN, skipping deploy')
  }

  const previewUrl = vercelUrl ?? localUrl

  // Step 3: Save to DB
  let site
  try {
    site = await db.generatedSite.upsert({
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
        primaryColor,
        template,
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
        primaryColor,
        template,
        vercelUrl,
      },
    })

    await db.lead.update({ where: { id: leadId }, data: { previewUrl } })
  } catch (err) {
    console.error('[generate] DB save failed:', err)
    return NextResponse.json({ error: 'DB save failed', detail: String(err) }, { status: 500 })
  }

  return NextResponse.json({ site, previewUrl, vercelUrl, deployError })
}
