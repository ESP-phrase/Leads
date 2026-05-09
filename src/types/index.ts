export interface Lead {
  id: string
  name: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  category: string | null
  rating: number | null
  reviewCount: number | null
  placeId: string | null
  hasWebsite: boolean
  hasShopify: boolean
  websiteUrl: string | null
  slug: string | null
  status: LeadStatus
  notes: string | null
  previewUrl: string | null
  invoiceUrl: string | null
  invoicePaid: boolean
  invoicedAt: string | null
  site: GeneratedSite | null
  smsLogs: SmsLog[]
  createdAt: string
  updatedAt: string
}

export type LeadStatus =
  | 'FOUND'
  | 'CALLED'
  | 'TEXTED'
  | 'INTERESTED'
  | 'CLOSED'
  | 'NOT_INTERESTED'

export interface GeneratedSite {
  id: string
  leadId: string
  headline: string
  subheadline: string
  services: string
  aboutText: string
  cityServed: string
  phone: string | null
  address: string | null
  primaryColor: string
  template: string
  vercelUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface SmsLog {
  id: string
  leadId: string
  message: string
  status: string
  messageSid: string | null
  sentAt: string
}
