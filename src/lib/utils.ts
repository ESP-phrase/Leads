export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 11) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return phone
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    FOUND: 'Found',
    CALLED: 'Called',
    TEXTED: 'Texted',
    INTERESTED: 'Interested',
    CLOSED: 'Closed',
    NOT_INTERESTED: 'Not Interested',
  }
  return labels[status] ?? status
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    FOUND: 'bg-slate-100 text-slate-700',
    CALLED: 'bg-blue-100 text-blue-700',
    TEXTED: 'bg-violet-100 text-violet-700',
    INTERESTED: 'bg-amber-100 text-amber-700',
    CLOSED: 'bg-emerald-100 text-emerald-700',
    NOT_INTERESTED: 'bg-red-100 text-red-700',
  }
  return colors[status] ?? 'bg-gray-100 text-gray-700'
}
