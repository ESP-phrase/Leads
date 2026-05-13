import type { Metadata } from 'next'
import LandingAgents from '../_landing'

// Agent-recruitment landing — preserved at /agents during 10DLC review.
// Not linked from the public homepage, blocked in robots.txt, excluded from sitemap.
// Direct link only: webhustle.org/agents

export const metadata: Metadata = {
  title: 'Agents — WebHustle',
  description: 'Information for WebHustle sales agents.',
  robots: { index: false, follow: false },
}

export default function AgentsPage() {
  return <LandingAgents />
}
