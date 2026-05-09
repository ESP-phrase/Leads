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

function starsSvg(rating: number, size = 16) {
  return [1,2,3,4,5].map(i => {
    const filled = i <= Math.round(rating)
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? '#fde047' : 'none'}" stroke="#fde047" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  }).join('')
}

const phoneSvg = (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12.5 19.79 19.79 0 0 1 1.07 3.87 2 2 0 0 1 3.06 1.69h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.01z"/></svg>`
const mapPinSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
const checkSvg = (color: string) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
const shieldSvg = (color: string) => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
const clockSvg = (color: string) => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
const starSmSvg = (color: string) => `<svg width="14" height="14" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
const chevronSvg = (color: string) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

export function renderSiteHtml(data: SiteData): string {
  const { businessName, headline, subheadline, services, aboutText, phone, address, city, category, rating, reviewCount, primaryColor } = data
  const rgb = hexToRgb(primaryColor)
  const year = new Date().getFullYear()

  const faqs = [
    { q: 'How quickly can you come out?', a: `We offer same-day and next-day availability for most jobs in ${city}. Call us and we'll do our best to fit you in.` },
    { q: 'Do you offer free estimates?', a: 'Yes — all consultations and quotes are completely free with no obligation. We believe you should know the cost before committing.' },
    { q: 'Are you licensed and insured?', a: `Absolutely. We are fully licensed and insured to operate in ${city} and surrounding areas. Your home and peace of mind are protected.` },
    { q: 'What areas do you serve?', a: `We proudly serve ${city} and the surrounding communities. Not sure if we cover your area? Give us a call — we're happy to help.` },
    { q: 'How do I get started?', a: phone ? `Just give us a call at ${phone} or click any "Call Now" button on this page. We'll ask a few quick questions and get you scheduled.` : 'Click the "Free Quote" button above to get in touch. We respond quickly and will work around your schedule.' },
  ]

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${businessName}</title>
  <meta name="description" content="${headline}"/>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:system-ui,-apple-system,sans-serif}
    a{text-decoration:none}
    :root{--p:${primaryColor};--pr:${rgb}}
    .c-btn{background:var(--p);transition:filter .15s}
    .c-btn:hover{filter:brightness(.9)}
    .c-bg{background:var(--p)}
    .c-shadow{box-shadow:0 8px 32px rgba(var(--pr),.35)}
    .service-card{border:2px solid #f3f4f6;border-radius:16px;padding:24px 20px;transition:border-color .2s,box-shadow .2s}
    .service-card:hover{border-color:var(--p);box-shadow:0 4px 20px rgba(var(--pr),.12)}
    .faq-item{border-bottom:1px solid #f3f4f6;padding:24px 0}
    .faq-item:first-child{border-top:1px solid #f3f4f6}
    @media(max-width:640px){.hero-btns{flex-direction:column}.nav-phone{display:none}}
  </style>
</head>
<body>

<!-- NAV -->
<nav style="background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.08);position:sticky;top:0;z-index:50">
  <div style="max-width:1100px;margin:0 auto;padding:0 1.5rem;display:flex;align-items:center;justify-content:space-between;height:64px">
    <span style="font-size:20px;font-weight:800;color:#111">${businessName}</span>
    <div style="display:flex;align-items:center;gap:12px">
      <a href="#faq" style="color:#6b7280;font-size:14px;font-weight:500">FAQ</a>
      ${phone ? `<a href="tel:${phone}" class="c-btn c-shadow nav-phone" style="color:#fff;display:flex;align-items:center;gap:8px;border-radius:9999px;font-weight:700;font-size:14px;padding:10px 20px">${phoneSvg(14)}${phone}</a>` : ''}
    </div>
  </div>
</nav>

<!-- HERO -->
<section class="c-bg" style="padding:96px 1.5rem;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;opacity:.1;background:radial-gradient(ellipse at 75% 40%,#fff 0%,transparent 65%)"></div>
  <div style="max-width:1100px;margin:0 auto;position:relative">
    <div style="max-width:640px">
      ${rating ? `<div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">${starsSvg(rating, 16)}<span style="color:rgba(255,255,255,.7);font-size:13px">${rating} · ${reviewCount} Google reviews</span></div>` : ''}
      <h1 style="font-size:clamp(2rem,5vw,3.25rem);font-weight:900;line-height:1.1;color:#fff;margin-bottom:16px">${headline}</h1>
      <p style="font-size:18px;color:rgba(255,255,255,.78);margin-bottom:36px;line-height:1.65">${subheadline}</p>
      <div class="hero-btns" style="display:flex;flex-wrap:wrap;gap:12px">
        ${phone ? `<a href="tel:${phone}" style="background:#fff;color:${primaryColor};padding:14px 28px;border-radius:9999px;font-weight:800;font-size:17px;display:flex;align-items:center;gap:8px;box-shadow:0 4px 20px rgba(0,0,0,.15)">${phoneSvg(18)}Call Now</a>` : ''}
        <a href="#contact" style="background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.45);color:#fff;padding:14px 28px;border-radius:9999px;font-weight:700;font-size:17px">Free Quote →</a>
      </div>
    </div>
  </div>
</section>

<!-- TRUST STRIP -->
<section style="background:#111;padding:16px 1.5rem">
  <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;gap:24px;justify-content:center">
    <div style="display:flex;align-items:center;gap:7px;color:#9ca3af;font-size:13px;font-weight:500">${shieldSvg(primaryColor)}Licensed &amp; Insured</div>
    <div style="display:flex;align-items:center;gap:7px;color:#9ca3af;font-size:13px;font-weight:500">${checkSvg(primaryColor).replace('24"', '14"').replace('24"', '14"')}Free Estimates</div>
    <div style="display:flex;align-items:center;gap:7px;color:#9ca3af;font-size:13px;font-weight:500">${clockSvg(primaryColor)}Same-Day Available</div>
    <div style="display:flex;align-items:center;gap:7px;color:#9ca3af;font-size:13px;font-weight:500">${starSmSvg(primaryColor)}Serving ${city}</div>
  </div>
</section>

<!-- CTA BAND -->
<section style="background:#f9fafb;padding:56px 1.5rem;border-bottom:1px solid #f3f4f6">
  <div style="max-width:800px;margin:0 auto;text-align:center">
    <h2 style="font-size:clamp(1.5rem,3.5vw,2.1rem);font-weight:900;color:#111;margin-bottom:12px">Need a ${category} in ${city}? We're ready.</h2>
    <p style="color:#6b7280;font-size:16px;margin-bottom:28px;line-height:1.6">Don't wait. Get a free, no-obligation quote today — we respond fast and work around your schedule.</p>
    ${phone ? `<a href="tel:${phone}" class="c-btn c-shadow" style="color:#fff;padding:15px 32px;border-radius:9999px;font-weight:800;font-size:17px;display:inline-flex;align-items:center;gap:10px">${phoneSvg(18)}Get a Free Quote — Call ${phone}</a>` : ''}
  </div>
</section>

<!-- SERVICES -->
<section id="services" style="padding:88px 1.5rem;background:#fff">
  <div style="max-width:1100px;margin:0 auto">
    <div style="text-align:center;margin-bottom:52px">
      <h2 style="font-size:clamp(1.75rem,4vw,2.5rem);font-weight:900;color:#111;margin-bottom:10px">What We Do</h2>
      <p style="color:#6b7280;font-size:17px">Professional ${category.toLowerCase()} services in ${city}</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
      ${services.map(s => `<div class="service-card">${checkSvg(primaryColor)}<p style="font-weight:700;color:#111;font-size:15px;margin-top:12px">${s}</p></div>`).join('')}
    </div>
  </div>
</section>

<!-- ABOUT -->
<section id="about" style="padding:88px 1.5rem;background:#f9fafb">
  <div style="max-width:740px;margin:0 auto;text-align:center">
    <h2 style="font-size:clamp(1.75rem,4vw,2.5rem);font-weight:900;color:#111;margin-bottom:20px">Why Choose ${businessName}</h2>
    <p style="color:#4b5563;font-size:18px;line-height:1.75;margin-bottom:36px">${aboutText}</p>
    ${rating ? `<div style="display:inline-flex;align-items:center;gap:20px;background:#fff;border-radius:20px;padding:20px 32px;box-shadow:0 2px 16px rgba(0,0,0,.07);border:1px solid #f3f4f6">
      <div>
        <div style="display:flex;margin-bottom:4px">${starsSvg(rating, 20)}</div>
        <p style="color:#9ca3af;font-size:12px">${reviewCount} Google Reviews</p>
      </div>
      <div style="width:1px;height:40px;background:#e5e7eb"></div>
      <div>
        <p style="font-size:36px;font-weight:900;color:#111;line-height:1">${rating}</p>
        <p style="color:#9ca3af;font-size:12px">Average Rating</p>
      </div>
    </div>` : ''}
  </div>
</section>

<!-- FAQ -->
<section id="faq" style="padding:88px 1.5rem;background:#fff">
  <div style="max-width:740px;margin:0 auto">
    <div style="text-align:center;margin-bottom:52px">
      <h2 style="font-size:clamp(1.75rem,4vw,2.5rem);font-weight:900;color:#111;margin-bottom:10px">Frequently Asked Questions</h2>
      <p style="color:#6b7280;font-size:17px">Everything you need to know before you call.</p>
    </div>
    <div>
      ${faqs.map(({ q, a }) => `<div class="faq-item">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:10px">
          <h3 style="font-size:17px;font-weight:700;color:#111;flex:1">${q}</h3>
          ${chevronSvg(primaryColor)}
        </div>
        <p style="color:#6b7280;font-size:16px;line-height:1.7">${a}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- FINAL CTA -->
<section id="contact" class="c-bg" style="padding:96px 1.5rem">
  <div style="max-width:800px;margin:0 auto;text-align:center">
    <h2 style="font-size:clamp(1.75rem,4vw,2.5rem);font-weight:900;color:#fff;margin-bottom:12px">Ready to Get Started?</h2>
    <p style="color:rgba(255,255,255,.72);font-size:17px;margin-bottom:48px;line-height:1.6">Call or reach out today. No pressure, no obligation — just honest work at a fair price.</p>
    <div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;margin-bottom:40px">
      ${phone ? `<a href="tel:${phone}" style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.25);border-radius:18px;padding:20px 28px;color:#fff">${phoneSvg(22)}<div style="text-align:left"><p style="font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px">Call Us</p><p style="font-weight:800;font-size:20px">${phone}</p></div></a>` : ''}
      ${address ? `<div style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.25);border-radius:18px;padding:20px 28px;color:#fff">${mapPinSvg}<div style="text-align:left"><p style="font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px">Location</p><p style="font-weight:700;font-size:14px;max-width:220px">${address}</p></div></div>` : ''}
    </div>
    ${phone ? `<a href="tel:${phone}" style="background:#fff;color:${primaryColor};padding:18px 44px;border-radius:9999px;font-weight:900;font-size:18px;display:inline-block;box-shadow:0 8px 32px rgba(0,0,0,.18)">Call Now — Free Estimate</a>` : ''}
  </div>
</section>

<!-- FOOTER -->
<footer style="background:#0a0a0a;color:#374151;padding:28px 1.5rem;text-align:center;font-size:13px">
  <p style="color:#6b7280">© ${year} ${businessName} · ${city}</p>
  <p style="margin-top:4px;font-size:11px">Site by Canvass</p>
</footer>

</body>
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
