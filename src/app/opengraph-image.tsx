import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SiteForge — Earn $119 per sale from your phone'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#0a0b09',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -200, right: -200,
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, #c8f13520 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(#1e2218 1px, transparent 1px), linear-gradient(90deg, #1e2218 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.4,
          display: 'flex',
        }} />

        {/* Logo mark */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: '#c8f135',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 52 52" width="38" height="38">
              <polygon points="14,10 14,38 22,30 27,42 31,40 26,28 36,28" fill="#0a0b09"/>
            </svg>
          </div>
          <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px' }}>
            <span style={{ color: '#c8f135' }}>Site</span>
            <span style={{ color: '#ffffff' }}>Forge</span>
          </span>
        </div>

        {/* Main headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>
          <div style={{ fontSize: 72, fontWeight: 900, color: '#ffffff', lineHeight: 1.05, letterSpacing: '-2px', display: 'flex', flexWrap: 'wrap' }}>
            Earn&nbsp;
            <span style={{ color: '#c8f135' }}>$119</span>
            &nbsp;Per Sale
          </div>
          <div style={{ fontSize: 28, color: '#6b7a5a', fontWeight: 500, lineHeight: 1.4 }}>
            We build the website. You send one text.<br />
            Local businesses pay $299. You keep $119.
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 40, marginTop: 56 }}>
          {[
            { val: '$119', label: 'Per closed sale' },
            { val: '24h', label: 'Application review' },
            { val: '$5', label: 'Refundable deposit' },
          ].map(({ val, label }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#c8f135' }}>{val}</span>
              <span style={{ fontSize: 18, color: '#4a5a3a', fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* URL badge */}
        <div style={{
          position: 'absolute', bottom: 60, right: 80,
          background: '#c8f13515', border: '1px solid #c8f13530',
          borderRadius: 999, padding: '10px 24px',
          fontSize: 22, fontWeight: 700, color: '#c8f135',
          display: 'flex',
        }}>
          siteforge.app
        </div>
      </div>
    ),
    { ...size }
  )
}
