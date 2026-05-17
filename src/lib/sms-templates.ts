export interface SmsTemplate {
  id: string
  label: string
  emoji: string
  body: string
  stage: 'first-touch' | 'follow-up' | 'closing'
}

// Placeholders: {name}, {business}, {link}, {city}, {category}, {price}
// {price} resolves at send-time to the lead's wealth-tier price ("$149"–"$799").
export const SMS_TEMPLATES: SmsTemplate[] = [
  {
    id: 'preview-soft',
    label: 'Soft preview pitch',
    emoji: '👋',
    stage: 'first-touch',
    body: `Hey, I noticed {business} doesn't have a website yet — I built you a quick preview to show what one could look like:

{link}

If you like it, I can have it live for you this week. No pressure!`,
  },
  {
    id: 'preview-direct',
    label: 'Direct preview pitch',
    emoji: '🚀',
    stage: 'first-touch',
    body: `Hi! Just made a free website preview for {business} — check it out: {link}

Want me to make it live? Reply YES.`,
  },
  {
    id: 'preview-question',
    label: 'Curious question opener',
    emoji: '🤔',
    stage: 'first-touch',
    body: `Hi, quick question — would a clean modern website help {business} get more {category} customers in {city}?

I built one for you to see: {link}`,
  },
  {
    id: 'follow-up-24h',
    label: '24-hour follow-up',
    emoji: '⏰',
    stage: 'follow-up',
    body: `Hey {name}, just following up on the website preview I sent for {business}: {link}

Any thoughts? Happy to tweak the colors/copy if it's close.`,
  },
  {
    id: 'follow-up-week',
    label: '1-week check-in',
    emoji: '📞',
    stage: 'follow-up',
    body: `Hey {name}, hope business is going well! Did you get a chance to look at the website I made for {business}?

{link}

Let me know if you want to chat — I'm flexible on price.`,
  },
  {
    id: 'follow-up-final',
    label: 'Last chance',
    emoji: '🎯',
    stage: 'follow-up',
    body: `Hi {name} — last check-in. The site for {business} is still live: {link}

If you want it, {price} gets it on a real domain. Otherwise, no worries — wish you the best!`,
  },
  {
    id: 'closing-discount',
    label: 'Limited-time discount',
    emoji: '💰',
    stage: 'closing',
    body: `{name}! Quick offer — first 5 new clients this week get the website at a one-time discount off our usual {price}.

Yours: {link}

Grab it: reply YES and I'll send a payment link.`,
  },
  {
    id: 'closing-payment',
    label: 'Send payment link',
    emoji: '✅',
    stage: 'closing',
    body: `Awesome, {name}! Here's the payment link for {business}'s website ({price}):

{link}

Once paid, I'll send you the live URL within 24 hours.`,
  },
]

export function renderTemplate(
  template: string,
  vars: {
    name?: string | null
    business: string
    link: string
    city?: string | null
    category?: string | null
    price?: string | null
  },
): string {
  return template
    .replace(/\{name\}/g, vars.name || 'there')
    .replace(/\{business\}/g, vars.business)
    .replace(/\{link\}/g, vars.link)
    .replace(/\{city\}/g, vars.city || 'your area')
    .replace(/\{category\}/g, vars.category || 'business')
    .replace(/\{price\}/g, vars.price || '$299')
}
