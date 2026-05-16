import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Friendly redirect: www.webhustle.org/s/mike-plumbing → mike-plumbing-x.vercel.app
// This hides the underlying vercel.app domain from the SMS recipient.
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const base = _.url ? new URL(_.url).origin : 'https://www.webhustle.org'

  // Static demo — always works, used for 10DLC sample links and testing
  if (slug === 'demo') {
    return NextResponse.redirect('https://moms-test-shop-5cz2qcjli-esp-phrases-projects.vercel.app/', 302)
  }

  const lead = await db.lead.findFirst({
    where: { slug },
    include: { site: true },
  })

  if (!lead) {
    return NextResponse.redirect(new URL('/', base), 302)
  }

  const target = lead.site?.vercelUrl ?? lead.previewUrl
  if (!target) {
    // Fall back to the in-app preview page if no external URL is set
    return NextResponse.redirect(new URL(`/preview/${slug}`, base), 302)
  }

  return NextResponse.redirect(target, 302)
}
