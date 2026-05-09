'use client'

import { CheckCircle, Phone, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function JoinSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0d0e0b' }}>
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: '#c8f13520', border: '2px solid #c8f13540' }}>
          <CheckCircle size={40} style={{ color: '#c8f135' }} />
        </div>

        <h1 className="text-3xl font-black text-white mb-3">You're in!</h1>
        <p className="text-lg mb-2" style={{ color: '#6b7a5a' }}>
          Welcome to the Canvass team.
        </p>
        <p className="text-sm mb-8" style={{ color: '#4a5a3a' }}>
          Your account is active. You'll receive a text with login instructions shortly.
        </p>

        {/* Earnings reminder */}
        <div className="rounded-2xl p-6 mb-8 text-left" style={{ background: '#111310', border: '1px solid #1e2218' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#3a4a2a' }}>
            Your earning potential
          </p>
          <div className="space-y-3">
            {[
              { label: 'Per website sold', value: '$119', note: 'your 40% cut' },
              { label: '5 sites/month', value: '$595', note: 'part-time' },
              { label: '15 sites/month', value: '$1,785', note: 'full-time push' },
            ].map(({ label, value, note }) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">{label}</p>
                  <p className="text-xs" style={{ color: '#3a4a2a' }}>{note}</p>
                </div>
                <span className="text-lg font-black" style={{ color: '#c8f135' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What's next */}
        <div className="rounded-2xl p-6 mb-8 text-left" style={{ background: '#111310', border: '1px solid #1e2218' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#3a4a2a' }}>
            What happens next
          </p>
          <div className="space-y-4">
            {[
              { step: '1', text: 'We\'ll text you your login details within the hour' },
              { step: '2', text: 'Log in and you\'ll see your assigned leads ready to call' },
              { step: '3', text: 'Use the built-in dialer and SMS tools to pitch businesses' },
              { step: '4', text: 'When a business buys, $119 hits your account' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: '#c8f13520', border: '1px solid #c8f13540' }}>
                  <span className="text-xs font-bold" style={{ color: '#c8f135' }}>{step}</span>
                </div>
                <p className="text-sm" style={{ color: '#6b7a5a' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#3a4a2a' }}>
          <Phone size={13} />
          <span>Questions? Text us at <span className="text-white">512-796-7462</span></span>
        </div>
      </div>
    </div>
  )
}
