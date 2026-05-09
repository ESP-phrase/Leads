import { Phone, MapPin, Star, CheckCircle, Clock, Shield, ChevronDown } from 'lucide-react'

interface Props {
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
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

export default function ModernTemplate({
  businessName, headline, subheadline, services, aboutText,
  phone, address, city, category, rating, reviewCount, primaryColor,
}: Props) {
  const rgb = hexToRgb(primaryColor)

  const faqs = [
    {
      q: 'How quickly can you come out?',
      a: `We offer same-day and next-day availability for most jobs in ${city}. Call us and we'll do our best to fit you in.`,
    },
    {
      q: 'Do you offer free estimates?',
      a: 'Yes — all consultations and quotes are completely free with no obligation. We believe you should know the cost before committing.',
    },
    {
      q: 'Are you licensed and insured?',
      a: `Absolutely. We are fully licensed and insured to operate in ${city} and surrounding areas. Your home and peace of mind are protected.`,
    },
    {
      q: `What areas do you serve?`,
      a: `We proudly serve ${city} and the surrounding communities. Not sure if we cover your area? Give us a call — we're happy to help.`,
    },
    {
      q: 'How do I get started?',
      a: phone
        ? `Just give us a call at ${phone} or click any "Call Now" button on this page. We'll ask a few quick questions and get you scheduled.`
        : 'Click the "Free Quote" button above to get in touch. We respond quickly and will work around your schedule.',
    },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: 0 }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --p: ${primaryColor}; --pr: ${rgb}; }
        .c-btn { background: var(--p); transition: filter .15s; }
        .c-btn:hover { filter: brightness(0.9); }
        .c-text { color: var(--p); }
        .c-bg { background: var(--p); }
        .c-shadow { box-shadow: 0 8px 32px rgba(var(--pr), 0.35); }
        .service-card { border: 2px solid #f3f4f6; border-radius: 16px; padding: 24px 20px; transition: border-color .2s, box-shadow .2s; }
        .service-card:hover { border-color: var(--p); box-shadow: 0 4px 20px rgba(var(--pr), 0.12); }
        .faq-item { border-bottom: 1px solid #f3f4f6; padding: 24px 0; }
        .faq-item:first-child { border-top: 1px solid #f3f4f6; }
        a { text-decoration: none; }
      `}</style>

      {/* Nav */}
      <nav style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.08)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#111' }}>{businessName}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="#faq" style={{ color: '#6b7280', fontSize: 14, fontWeight: 500 }}>FAQ</a>
            {phone && (
              <a href={`tel:${phone}`}
                 className="c-btn c-shadow"
                 style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 9999, fontWeight: 700, fontSize: 14, padding: '10px 20px' }}>
                <Phone size={14} />{phone}
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="c-bg" style={{ padding: '96px 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(ellipse at 75% 40%, #fff 0%, transparent 65%)' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div style={{ maxWidth: 640 }}>
            {rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={16} fill={i <= Math.round(rating) ? '#fde047' : 'none'} stroke="#fde047" />
                ))}
                <span style={{ color: 'rgba(255,255,255,.7)', fontSize: 13 }}>
                  {rating} · {reviewCount} Google reviews
                </span>
              </div>
            )}
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, lineHeight: 1.1, color: '#fff', marginBottom: 16 }}>
              {headline}
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,.78)', marginBottom: 36, lineHeight: 1.65 }}>
              {subheadline}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {phone && (
                <a href={`tel:${phone}`}
                   style={{ background: '#fff', color: primaryColor, padding: '14px 28px', borderRadius: 9999,
                            fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8,
                            boxShadow: '0 4px 20px rgba(0,0,0,.15)' }}>
                  <Phone size={18} />Call Now
                </a>
              )}
              <a href="#contact"
                 style={{ background: 'rgba(255,255,255,.15)', border: '2px solid rgba(255,255,255,.45)',
                          color: '#fff', padding: '14px 28px', borderRadius: 9999, fontWeight: 700, fontSize: 17 }}>
                Free Quote →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ background: '#111', padding: '16px 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          {[
            { icon: Shield,       t: 'Licensed & Insured' },
            { icon: CheckCircle, t: 'Free Estimates' },
            { icon: Clock,       t: 'Same-Day Available' },
            { icon: Star,        t: `Serving ${city}` },
          ].map(({ icon: Icon, t }) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#9ca3af', fontSize: 13, fontWeight: 500 }}>
              <Icon size={14} style={{ color: primaryColor }} />{t}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ background: '#f9fafb', padding: '56px 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)', fontWeight: 900, color: '#111', marginBottom: 12 }}>
            Need a {category} in {city}? We&apos;re ready.
          </h2>
          <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>
            Don&apos;t wait. Get a free, no-obligation quote today — we respond fast and work around your schedule.
          </p>
          {phone && (
            <a href={`tel:${phone}`}
               className="c-btn c-shadow"
               style={{ color: '#fff', padding: '15px 32px', borderRadius: 9999, fontWeight: 800, fontSize: 17, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Phone size={18} />Get a Free Quote — Call {phone}
            </a>
          )}
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ padding: '88px 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#111', marginBottom: 10 }}>
              What We Do
            </h2>
            <p style={{ color: '#6b7280', fontSize: 17 }}>Professional {category.toLowerCase()} services in {city}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {services.map(s => (
              <div key={s} className="service-card">
                <CheckCircle size={24} style={{ color: primaryColor, marginBottom: 12 }} />
                <p style={{ fontWeight: 700, color: '#111', fontSize: 15 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: '88px 1.5rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: 740, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#111', marginBottom: 20 }}>
            Why Choose {businessName}
          </h2>
          <p style={{ color: '#4b5563', fontSize: 18, lineHeight: 1.75, marginBottom: 36 }}>{aboutText}</p>
          {rating && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 20, background: '#fff',
                          borderRadius: 20, padding: '20px 32px', boxShadow: '0 2px 16px rgba(0,0,0,.07)', border: '1px solid #f3f4f6' }}>
              <div>
                <div style={{ display: 'flex', marginBottom: 4 }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={20} fill={i <= Math.round(rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" />
                  ))}
                </div>
                <p style={{ color: '#9ca3af', fontSize: 12 }}>{reviewCount} Google Reviews</p>
              </div>
              <div style={{ width: 1, height: 40, background: '#e5e7eb' }} />
              <div>
                <p style={{ fontSize: 36, fontWeight: 900, color: '#111', lineHeight: 1 }}>{rating}</p>
                <p style={{ color: '#9ca3af', fontSize: 12 }}>Average Rating</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '88px 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#111', marginBottom: 10 }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: '#6b7280', fontSize: 17 }}>Everything you need to know before you call.</p>
          </div>
          <div>
            {faqs.map(({ q, a }) => (
              <div key={q} className="faq-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 10 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111', flex: 1 }}>{q}</h3>
                  <ChevronDown size={18} style={{ color: primaryColor, flexShrink: 0, marginTop: 2 }} />
                </div>
                <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section id="contact" className="c-bg" style={{ padding: '96px 1.5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
            Ready to Get Started?
          </h2>
          <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 17, marginBottom: 48, lineHeight: 1.6 }}>
            Call or reach out today. No pressure, no obligation — just honest work at a fair price.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 40 }}>
            {phone && (
              <a href={`tel:${phone}`}
                 style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.12)',
                          border: '2px solid rgba(255,255,255,.25)', borderRadius: 18, padding: '20px 28px', color: '#fff' }}>
                <Phone size={22} />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Call Us</p>
                  <p style={{ fontWeight: 800, fontSize: 20 }}>{phone}</p>
                </div>
              </a>
            )}
            {address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.12)',
                            border: '2px solid rgba(255,255,255,.25)', borderRadius: 18, padding: '20px 28px', color: '#fff' }}>
                <MapPin size={22} />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Location</p>
                  <p style={{ fontWeight: 700, fontSize: 14, maxWidth: 220 }}>{address}</p>
                </div>
              </div>
            )}
          </div>
          {phone && (
            <a href={`tel:${phone}`}
               style={{ background: '#fff', color: primaryColor, padding: '18px 44px', borderRadius: 9999,
                        fontWeight: 900, fontSize: 18, display: 'inline-block',
                        boxShadow: '0 8px 32px rgba(0,0,0,.18)' }}>
              Call Now — Free Estimate
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a0a0a', color: '#374151', padding: '28px 1.5rem', textAlign: 'center', fontSize: 13 }}>
        <p style={{ color: '#6b7280' }}>© {new Date().getFullYear()} {businessName} · {city}</p>
        <p style={{ marginTop: 4, fontSize: 11 }}>Site by Website Hustle</p>
      </footer>
    </div>
  )
}
