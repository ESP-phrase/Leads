'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Phone, PhoneOff, Mic, MicOff, X, Loader2, PhoneCall, Volume2 } from 'lucide-react'

interface DialerProps {
  lead: { id: string; name: string; phone: string | null; category?: string | null; city?: string | null }
  onClose: () => void
}

type CallState = 'idle' | 'connecting' | 'ringing' | 'active' | 'ended' | 'error'

export default function Dialer({ lead, onClose }: DialerProps) {
  const [callState, setCallState] = useState<CallState>('idle')
  const [muted, setMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [sdkReady, setSdkReady] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callRef = useRef<any>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load Telnyx SDK client-side only
  useEffect(() => {
    let mounted = true
    async function loadSdk() {
      try {
        const { TelnyxRTC } = await import('@telnyx/webrtc')
        const tokenRes = await fetch('/api/telnyx/token')
        if (!tokenRes.ok) throw new Error('Could not get Telnyx token')
        const { token } = await tokenRes.json()
        if (!token) throw new Error('Telnyx not configured — set TELNYX_SIP_CONNECTION_ID')

        const client = new TelnyxRTC({ login_token: token })

        client.on('telnyx.ready', () => { if (mounted) setSdkReady(true) })
        client.on('telnyx.error', (err: { message?: string }) => {
          if (mounted) { setErrorMsg(err?.message ?? 'Telnyx error'); setCallState('error') }
        })
        client.on('telnyx.notification', (notification: { call?: { state: string } }) => {
          if (!mounted) return
          const state = notification?.call?.state
          if (state === 'ringing') setCallState('ringing')
          if (state === 'active') {
            setCallState('active')
            timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
          }
          if (state === 'destroy' || state === 'hangup') {
            setCallState('ended')
            if (timerRef.current) clearInterval(timerRef.current)
          }
        })

        client.connect()
        clientRef.current = client
      } catch (err) {
        if (mounted) { setErrorMsg(String(err)); setCallState('error') }
      }
    }
    loadSdk()
    return () => { mounted = false }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      callRef.current?.hangup()
      clientRef.current?.disconnect()
    }
  }, [])

  const startCall = useCallback(async () => {
    if (!lead.phone || !clientRef.current || !sdkReady) return
    setCallState('connecting')
    setDuration(0)
    setErrorMsg(null)
    try {
      const call = clientRef.current.newCall({
        destinationNumber: lead.phone,
        callerNumber: process.env.NEXT_PUBLIC_TELNYX_PHONE ?? '+15303241556',
      })
      callRef.current = call
    } catch (err) {
      setErrorMsg(String(err))
      setCallState('error')
    }
  }, [lead.phone, sdkReady])

  const hangup = useCallback(() => {
    callRef.current?.hangup()
    if (timerRef.current) clearInterval(timerRef.current)
    setCallState('ended')
  }, [])

  const toggleMute = useCallback(() => {
    if (!callRef.current) return
    if (muted) callRef.current.unmute()
    else callRef.current.mute()
    setMuted(m => !m)
  }, [muted])

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const stateColor: Record<CallState, string> = {
    idle: '#3a4a2a', connecting: '#d4a44a', ringing: '#d4a44a',
    active: '#c8f135', ended: '#6b7a5a', error: '#d45a5a',
  }
  const stateLabel: Record<CallState, string> = {
    idle: 'Ready', connecting: 'Connecting…', ringing: 'Ringing…',
    active: fmt(duration), ended: 'Call ended', error: errorMsg ?? 'Error',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: '#00000080' }}>
      <div className="rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm" style={{ background: '#111310', border: '1px solid #1e2218' }}>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#1e2218]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background: '#c8f13518', border: '1px solid #c8f13530' }}>
              <PhoneCall size={16} style={{ color: '#c8f135' }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">{lead.name}</p>
              <p className="text-xs mt-0.5" style={{ color: '#4a5a3a' }}>
                {[lead.category, lead.city].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#3a4a2a' }}><X size={16} /></button>
        </div>

        {/* Call display */}
        <div className="px-5 py-8 flex flex-col items-center gap-6">

          {/* Status ring */}
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center"
                 style={{ background: `${stateColor[callState]}15`, border: `2px solid ${stateColor[callState]}40` }}>
              {callState === 'connecting' || callState === 'ringing'
                ? <Loader2 size={36} className="animate-spin" style={{ color: stateColor[callState] }} />
                : callState === 'active'
                  ? <Volume2 size={36} style={{ color: '#c8f135' }} />
                  : callState === 'ended'
                    ? <PhoneOff size={36} style={{ color: '#6b7a5a' }} />
                    : <Phone size={36} style={{ color: stateColor[callState] }} />}
            </div>
            {callState === 'active' && (
              <div className="absolute inset-0 rounded-full animate-ping" style={{ background: '#c8f13508' }} />
            )}
          </div>

          {/* Phone + status */}
          <div className="text-center">
            <p className="text-lg font-bold text-white font-mono">{lead.phone}</p>
            <p className="text-sm mt-1 font-mono transition-all" style={{ color: stateColor[callState] }}>
              {stateLabel[callState]}
            </p>
            {!sdkReady && callState === 'idle' && (
              <p className="text-xs mt-1 flex items-center justify-center gap-1" style={{ color: '#3a4a2a' }}>
                <Loader2 size={10} className="animate-spin" /> Connecting to Telnyx…
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {callState === 'active' && (
              <button onClick={toggleMute}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                style={muted
                  ? { background: '#d45a5a20', border: '1px solid #d45a5a40', color: '#d45a5a' }
                  : { background: '#1e2218', border: '1px solid #2a3420', color: '#6b7a5a' }}>
                {muted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}

            {(callState === 'idle' || callState === 'error') && (
              <button
                onClick={startCall}
                disabled={!sdkReady || !lead.phone}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
                style={{ background: '#c8f135', color: '#0d0e0b' }}>
                <Phone size={24} />
              </button>
            )}

            {(callState === 'connecting' || callState === 'ringing' || callState === 'active') && (
              <button onClick={hangup}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
                style={{ background: '#d45a5a', color: '#fff' }}>
                <PhoneOff size={24} />
              </button>
            )}

            {callState === 'ended' && (
              <button onClick={() => { setCallState('idle'); setDuration(0) }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: '#c8f135', color: '#0d0e0b' }}>
                <Phone size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {errorMsg && callState === 'error' && (
          <div className="mx-5 mb-4 px-3 py-2.5 rounded-lg text-xs" style={{ background: '#2a0d0d', color: '#d45a5a', border: '1px solid #401515' }}>
            {errorMsg}
          </div>
        )}

        {/* Footer hint */}
        <div className="px-5 pb-4 text-center">
          <p className="text-xs" style={{ color: '#2a3a1a' }}>
            {callState === 'idle' ? 'Uses your browser mic · no phone needed' : ''}
            {callState === 'active' ? `${muted ? 'Muted — ' : ''}call in progress` : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
