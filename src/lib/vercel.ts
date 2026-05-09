import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import ModernTemplate from '@/components/templates/ModernTemplate'

interface SiteData {
  businessName: string
  headline: string
  subheadline: string
  services: string[]
  aboutText: string
  phone: string | null
  address: string | null
  city: string
  category: string
  rating: number | null
  reviewCount: number | null
  primaryColor: string
  slug: string
}

export function renderSiteHtml(data: SiteData): string {
  const body = renderToStaticMarkup(
    createElement(ModernTemplate, {
      businessName: data.businessName,
      headline: data.headline,
      subheadline: data.subheadline,
      services: data.services,
      aboutText: data.aboutText,
      phone: data.phone,
      address: data.address,
      city: data.city,
      category: data.category,
      rating: data.rating,
      reviewCount: data.reviewCount,
      primaryColor: data.primaryColor,
    })
  )

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.businessName}</title>
  <meta name="description" content="${data.headline}" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    a { text-decoration: none; }
    img { max-width: 100%; }
  </style>
</head>
<body>${body}</body>
</html>`
}

export async function deployToVercel(slug: string, html: string): Promise<string> {
  const token = process.env.VERCEL_TOKEN
  if (!token) throw new Error('VERCEL_TOKEN not set')

  const name = slug.slice(0, 52).replace(/[^a-z0-9-]/g, '-')

  const res = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      files: [{ file: 'index.html', data: html, encoding: 'utf-8' }],
      target: 'production',
      projectSettings: { framework: null },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Vercel deploy failed: ${JSON.stringify(err)}`)
  }

  const data = await res.json()
  // Poll until ready (Vercel deployments are async)
  return await waitForDeployment(data.id, token)
}

async function waitForDeployment(id: string, token: string, attempts = 20): Promise<string> {
  for (let i = 0; i < attempts; i++) {
    await new Promise(r => setTimeout(r, 3000))
    const res = await fetch(`https://api.vercel.com/v13/deployments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.readyState === 'READY') return `https://${data.url}`
    if (data.readyState === 'ERROR') throw new Error('Vercel deployment errored')
  }
  throw new Error('Vercel deployment timed out')
}
