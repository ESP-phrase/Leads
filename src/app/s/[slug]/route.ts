import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Friendly redirect: siteforge.app/s/mike-plumbing → mike-plumbing-x.vercel.app
// This hides the underlying vercel.app domain from the SMS recipient.
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const lead = await db.lead.findFirst({
    where: { slug },
    include: { site: true },
  })

  if (!lead) {
    return NextResponse.redirect(new URL('/', _.url ?? 'https://siteforge.app'), 302)
  }

  const target = lead.site?.vercelUrl ?? lead.previewUrl
  if (!target) {
    return NextResponse.redirect(new URL('/', _.url ?? 'https://siteforge.app'), 302)
  }

  return NextResponse.redirect(target, 302)
}
