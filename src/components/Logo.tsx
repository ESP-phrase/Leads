interface LogoProps {
  size?: number          // height of the mark in px
  showText?: boolean     // show "WebsiteHustle" wordmark next to the icon
  textSize?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const TEXT_SIZE = {
  sm: 14,
  md: 18,
  lg: 22,
  xl: 30,
}

export default function Logo({ size = 28, showText = true, textSize = 'md', className }: LogoProps) {
  const fontSize = TEXT_SIZE[textSize]

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, lineHeight: 1 }}>
      <span style={{
        width: size, height: size, borderRadius: size * 0.22,
        background: '#c8f135', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 0 ${size * 0.6}px ${size > 28 ? '#c8f13530' : '#c8f13520'}`,
      }}>
        <svg viewBox="0 0 32 32" width={size * 0.78} height={size * 0.78} xmlns="http://www.w3.org/2000/svg">
          <path d="M5 22 L10 13 L14 19 L18 11 L23 17 L27 9"
                stroke="#0a0b09" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <circle cx={27} cy={9} r={2.2} fill="#0a0b09"/>
        </svg>
      </span>
      {showText && (
        <span style={{ fontWeight: 900, fontSize, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
          <span style={{ color: '#c8f135' }}>Website</span><span style={{ color: '#fff' }}>Hustle</span>
        </span>
      )}
    </span>
  )
}
