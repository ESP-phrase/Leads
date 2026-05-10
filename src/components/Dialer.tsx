'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Phone, PhoneOff, X, Loader2, PhoneCall, Volume2, PhoneMissed } from 'lucide-react'

interface DialerProps {
  lead: { id: string; name: string; phone: string | null; category?: string | null; city?: string | null }
  onClose: () => void
}

type CallState = 'idle' | 'calling' | 'ringing' | 'active' | 'ended' | 'error'

const LOG_MAX = 30

export default function Dialer({ lead, onClose }: DialerProps) {
  const [callState, setCallState] = useState<CallState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [logs, setLogs] = useState<{ t: string; msg: string; ok: boolean }[]>([])
  const [callId, setCallId] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const log = useCallback((msg: string, ok = true) => {
    const t = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setLogs(l => [...l.slice(-LOG_MAX + 1), { t, msg, ok }])
    console.log(`[Dialer ${t}]`, msg)
  }, [])

  // Poll call status while active
  useEffect(() => {
    if (callId && (callState === 'ringing' || callState === 'active')) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/call/status?callId=${callId}`)
          if (!res.ok) return
          const data = await res.json()
          log(`Poll: ${data.state ?? 'unknown'}`)
          if (data.state === 'active' && callState !== 'active') {
            setCallState('active')
            timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
          }
          if (data.state === 'hangup' || data.state === 'destroyed') {
            setCallState('ended')
            clearInterval(pollRef.current!)
            clearInterval(timerRef.current!)
          }
        } catch { /* ignore poll errors */ }
      }, 2000)
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [callId, callState, log])

  const startCall = useCallback(async () => {
    if (!lead.phone) return
    setCallState('calling')
    setDuration(0)
    setErrorMsg(null)
    log(`Initiating call to ${lead.phone}…`)

    try {
      const res = await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id, phone: lead.phone }),
      })
      const data = await res.json()
      log(`API response: ${res.status} ${JSON.stringify(data).slice(0, 80)}`, res.ok)

      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)

      setCallId(data.callSid)
      setCallState('ringing')
      log(`Call initiated — your phone will ring now. Call ID: ${data.callSid?.slice(0, 20)}…`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`Error: ${msg}`, false)
      setErrorMsg(msg)
      setCallState('error')
    }
  }, [lead, log])

  const hangup = useCallback(async () => {
    if (callId) {
      log('Hanging up…')
      await fetch('/api/call/hangup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId }),
      }).catch(() => {})
    }
    clearInterval(timerRef.current!)
    clearInterval(pollRef.current!)
    setCallState('ended')
  }, [callId, log])

  useEffect(() => () => {
    clearInterval(timerRef.current!)
    clearInterval(pollRef.current!)
  }, [])

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const stateColor: Record<CallState, string> = {
    idle: '#3a4a2a', calling: '#d4a44a', ringing: '#4a9eff',
    active: '#c8f135', ended: '#6b7a5a', error: '#d45a5a',
  }
  const stateLabel: Record<CallState, string> = {
    idle: 'Ready', calling: 'Connecting…', ringing: '📱 Your phone is ringing…',
    active: `Live — ${fmt(duration)}`, ended: 'Call ended', error: errorMsg ?? 'Error',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: '#00000088' }}>
      <div className="rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden" style={{ background: '#111310', border: '1px solid #1e2218' }}>

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

        {/* Status */}
        <div className="px-5 py-6 flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center transition-all"
               style={{ background: `${stateColor[callState]}15`, border: `2px solid ${stateColor[callState]}40` }}>
            {callState === 'calling'
              ? <Loader2 size={32} className="animate-spin" style={{ color: stateColor[callState] }} />
              : callState === 'ringing'
                ? <Phone size={32} className="animate-bounce" style={{ color: stateColor[callState] }} />
                : callState === 'active'
                  ? <Volume2 size={32} style={{ color: '#c8f135' }} />
                  : callState === 'ended'
                    ? <PhoneMissed size={32} style={{ color: '#6b7a5a' }} />
                    : <Phone size={32} style={{ color: stateColor[callState] }} />}
          </div>

          <div className="text-center">
            <p className="text-base font-bold text-white font-mono">{lead.phone}</p>
            <p className="text-sm mt-1 transition-all" style={{ color: stateColor[callState] }}>
              {stateLabel[callState]}
            </p>
            {callState === 'ringing' && (
              <p className="text-xs mt-1" style={{ color: '#3a4a2a' }}>
                Pick up your phone — it will bridge to {lead.phone}
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            {(callState === 'idle' || callState === 'error') && (
              <button onClick={startCall}
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: '#c8f135', color: '#0d0e0b' }}>
                <Phone size={22} />
              </button>
            )}
            {(callState === 'calling' || callState === 'ringing' || callState === 'active') && (
              <button onClick={hangup}
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: '#d45a5a', color: '#fff' }}>
                <PhoneOff size={22} />
              </button>
            )}
            {callState === 'ended' && (
              <button onClick={() => { setCallState('idle'); setDuration(0); setCallId(null) }}
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: '#c8f135', color: '#0d0e0b' }}>
                <Phone size={22} />
              </button>
            )}
          </div>
        </div>

        {/* Live log panel */}
        {logs.length > 0 && (
          <div className="mx-4 mb-4 rounded-lg overflow-hidden" style={{ background: '#0a0b09', border: '1px solid #1e2218' }}>
            <p className="px-3 py-1.5 text-xs font-bold border-b border-[#1e2218]" style={{ color: '#3a4a2a' }}>Debug log</p>
            <div className="p-2 max-h-36 overflow-y-auto flex flex-col gap-0.5">
              {logs.map((l, i) => (
                <p key={i} className="text-xs font-mono" style={{ color: l.ok ? '#6b7a5a' : '#d45a5a' }}>
                  <span style={{ color: '#2a3a1a' }}>{l.t} </span>{l.msg}
                </p>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
