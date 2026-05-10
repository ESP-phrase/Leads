interface LogoProps {
  size?: number
  showText?: boolean
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
        <svg viewBox="0 0 52 52" width={size * 0.72} height={size * 0.72} xmlns="http://www.w3.org/2000/svg">
          <polygon points="14,10 14,38 22,30 27,42 31,40 26,28 36,28" fill="#0a0b09"/>
        </svg>
      </span>
      {showText && (
        <span style={{ fontWeight: 900, fontSize, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
          <span style={{ color: '#c8f135' }}>Site</span><span style={{ color: '#fff' }}>Forge</span>
        </span>
      )}
    </span>
  )
}
