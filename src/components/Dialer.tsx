'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Phone, PhoneOff, X, Loader2, PhoneCall, Volume2, PhoneMissed, Mic, MicOff, MessageSquare, Send, RefreshCw } from 'lucide-react'

interface DialerProps {
  lead: {
    id: string
    name: string
    phone: string | null
    category?: string | null
    city?: string | null
    previewUrl?: string | null
    slug?: string | null
  }
  onClose: () => void
}

type CallState = 'idle' | 'connecting' | 'ringing' | 'active' | 'ended' | 'error'

const LOG_MAX = 50

function safeJson(v: unknown): string {
  try { return JSON.stringify(v) } catch { return String(v) }
}

export default function Dialer({ lead, onClose }: DialerProps) {
  const [callState, setCallState] = useState<CallState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [logs, setLogs] = useState<{ t: string; msg: string; ok: boolean }[]>([])

  // Follow-up SMS state
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [draftMsg, setDraftMsg] = useState('')
  const [drafting, setDrafting] = useState(false)
  const [sending, setSending] = useState(false)
  const [smsSent, setSmsSent] = useState(false)
  const [tone, setTone] = useState('warm')

  const clientRef = useRef<unknown>(null)
  const callRef = useRef<unknown>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const callDurationRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null)
  const ringbackRef = useRef<{ ctx: AudioContext; stop: () => void } | null>(null)

  const log = useCallback((msg: string, ok = true) => {
    const t = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setLogs(l => [...l.slice(-LOG_MAX + 1), { t, msg: String(msg), ok }])
    console.log(`[Dialer ${t}]`, msg)
  }, [])

  const stopRingback = useCallback(() => {
    if (ringbackRef.current) {
      ringbackRef.current.stop()
      ringbackRef.current.ctx.close().catch(() => {})
      ringbackRef.current = null
    }
  }, [])

  const startRingback = useCallback(() => {
    stopRingback()
    try {
      const ctx = new AudioContext()
      let stopped = false
      // US ringback: 440Hz + 480Hz, 2s on / 4s off
      const play = () => {
        if (stopped) return
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const gain = ctx.createGain()
        osc1.frequency.value = 440
        osc2.frequency.value = 480
        gain.gain.value = 0.12
        osc1.connect(gain); osc2.connect(gain); gain.connect(ctx.destination)
        osc1.start(); osc2.start()
        osc1.stop(ctx.currentTime + 2); osc2.stop(ctx.currentTime + 2)
        setTimeout(() => { if (!stopped) play() }, 6000) // 2s on + 4s off
      }
      play()
      ringbackRef.current = { ctx, stop: () => { stopped = true } }
    } catch { /* audio not supported */ }
  }, [stopRingback])

  const cleanup = useCallback(() => {
    clearInterval(timerRef.current!)
    stopRingback()
    try { (callRef.current as { hangup?: () => void })?.hangup?.() } catch {}
    try { (clientRef.current as { disconnect?: () => void })?.disconnect?.() } catch {}
    callRef.current = null
    clientRef.current = null
    if (audioRef.current) { audioRef.current.srcObject = null; audioRef.current = null }
    if (remoteAudioRef.current) { remoteAudioRef.current.srcObject = null }
  }, [stopRingback])

  useEffect(() => () => cleanup(), [cleanup])

  // Track duration for "no answer" detection
  useEffect(() => { callDurationRef.current = duration }, [duration])

  const startCall = useCallback(async () => {
    if (!lead.phone) return
    setCallState('connecting')
    setErrorMsg(null)
    setDuration(0)
    setShowFollowUp(false)
    setSmsSent(false)
    log('Fetching WebRTC token…')

    try {
      const tokenRes = await fetch('/api/telnyx/token')
      const tokenData = await tokenRes.json()
      if (!tokenRes.ok) throw new Error(tokenData.error ?? 'Token fetch failed')
      log('Token received ✓')

      const { TelnyxRTC } = await import('@telnyx/webrtc')
      const client = new TelnyxRTC({
        login_token: tokenData.token,
        iceServers: [
          { urls: 'stun:stun.telnyx.com:3478' },
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      })
      clientRef.current = client

      client.on('telnyx.ready', () => {
        log('WebRTC ready — placing call…')
        const call = client.newCall({
          destinationNumber: lead.phone!,
          callerNumber: process.env.NEXT_PUBLIC_TELNYX_PHONE ?? '+15303241556',
          audio: true,
          video: false,
          remoteElement: remoteAudioRef.current ?? undefined,
        })
        callRef.current = call
      })

      // Telnyx notifications fire on the client, not the call
      client.on('telnyx.notification', (n: { call?: { state?: string; remoteStream?: MediaStream } }) => {
        const state = n?.call?.state
        if (!state) return
        log(`Call state: ${state}`)
        if (state === 'ringing' || state === 'trying') {
          setCallState('ringing')
          startRingback()
        } else if (state === 'active') {
          stopRingback()
          setCallState('active')
          timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
          // Attach remote audio stream to DOM element
          const remoteStream = n.call?.remoteStream
            ?? (callRef.current as { remoteStream?: MediaStream } | null)?.remoteStream
          if (remoteStream && remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream
            remoteAudioRef.current.play().catch(e => log(`Audio play error: ${e}`, false))
            log('Remote audio attached ✓')
          } else if (remoteStream) {
            // Fallback: dynamic audio element
            const el = new Audio()
            el.srcObject = remoteStream
            el.autoplay = true
            el.play().catch(() => {})
            audioRef.current = el
            log('Remote audio attached (fallback) ✓')
          } else {
            log('No remote stream yet — audio via remoteElement', true)
          }
        } else if (state === 'hangup' || state === 'destroy' || state === 'done') {
          clearInterval(timerRef.current!)
          if (audioRef.current) {
            audioRef.current.srcObject = null
            audioRef.current = null
          }
          setCallState('ended')
          setShowFollowUp(true)
        }
      })

      client.on('telnyx.error', (err: unknown) => {
        const code = (err as { error?: { code?: number } })?.error?.code
        const msg = (err as { error?: { message?: string } })?.error?.message
          ?? (err as { message?: string })?.message
          ?? safeJson(err)
        // BYE_SEND_FAILED and similar end-of-call errors — treat as normal end
        if (code === 44003 || code === 44001 || code === 44002) {
          log('Call ended cleanly')
          setCallState('ended')
          setShowFollowUp(true)
          return
        }
        log(`WebRTC error: ${msg}`, false)
        // Still show follow-up even on error if call was in progress
        setCallState('ended')
        setShowFollowUp(true)
      })

      client.on('telnyx.socket.close', () => {
        setCallState('ended')
        setShowFollowUp(true)
      })

      log('Connecting to Telnyx…')
      client.connect()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`Error: ${msg}`, false)
      setErrorMsg(msg)
      setCallState('error')
    }
  }, [lead, log, callState, startRingback, stopRingback])

  const hangup = useCallback(() => {
    log('Hanging up…')
    cleanup()
    setCallState('ended')
    setShowFollowUp(true)
  }, [cleanup, log])

  const toggleMute = useCallback(() => {
    const call = callRef.current as { muteAudio?: () => void; unmuteAudio?: () => void } | null
    if (!call) return
    if (muted) { call.unmuteAudio?.(); setMuted(false) }
    else { call.muteAudio?.(); setMuted(true) }
  }, [muted])

  const draftFollowUp = useCallback(async (selectedTone?: string) => {
    setDrafting(true)
    setDraftMsg('')
    try {
      const res = await fetch('/api/sms/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id, tone: selectedTone ?? tone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Draft failed')
      setDraftMsg(data.message)
    } catch (err) {
      setDraftMsg('')
      log(`Draft error: ${err instanceof Error ? err.message : String(err)}`, false)
    }
    setDrafting(false)
  }, [lead.id, log])

  const sendFollowUp = useCallback(async () => {
    if (!draftMsg) return
    setSending(true)
    try {
      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id, message: draftMsg, isFollowUp: true }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      setSmsSent(true)
      log('Follow-up SMS sent ✓')
    } catch (err) {
      log(`Send error: ${err instanceof Error ? err.message : String(err)}`, false)
    }
    setSending(false)
  }, [draftMsg, lead.id, log])

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const stateColor: Record<CallState, string> = {
    idle: '#3a4a2a', connecting: '#d4a44a', ringing: '#4a9eff',
    active: '#c8f135', ended: '#6b7a5a', error: '#d45a5a',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: '#00000088' }}>
      {/* Hidden remote audio element */}
      <audio ref={remoteAudioRef} autoPlay style={{ display: 'none' }} />
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

        {/* Call UI */}
        <div className="px-5 py-6 flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center transition-all"
               style={{ background: `${stateColor[callState]}15`, border: `2px solid ${stateColor[callState]}40` }}>
            {callState === 'connecting'
              ? <Loader2 size={32} className="animate-spin" style={{ color: stateColor[callState] }} />
              : callState === 'ringing'
                ? <Phone size={32} className="animate-bounce" style={{ color: stateColor[callState] }} />
                : callState === 'active'
                  ? <Volume2 size={32} className="animate-pulse" style={{ color: '#c8f135' }} />
                  : callState === 'ended'
                    ? <PhoneMissed size={32} style={{ color: '#6b7a5a' }} />
                    : <Phone size={32} style={{ color: stateColor[callState] }} />}
          </div>

          <div className="text-center">
            <p className="text-base font-bold text-white font-mono">{lead.phone}</p>
            <p className="text-sm mt-1" style={{ color: stateColor[callState] }}>
              {callState === 'idle' && 'Ready'}
              {callState === 'connecting' && 'Connecting…'}
              {callState === 'ringing' && 'Ringing…'}
              {callState === 'active' && `Live — ${fmt(duration)}`}
              {callState === 'ended' && (showFollowUp ? 'No answer' : 'Call ended')}
              {callState === 'error' && (errorMsg ?? 'Error')}
            </p>
          </div>

          <div className="flex gap-4 items-center">
            {(callState === 'idle' || callState === 'error') && (
              <button onClick={startCall}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: '#c8f135', color: '#0d0e0b' }}>
                <Phone size={22} />
              </button>
            )}
            {(callState === 'connecting' || callState === 'ringing' || callState === 'active') && (
              <>
                {callState === 'active' && (
                  <button onClick={toggleMute}
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: muted ? '#d45a5a30' : '#c8f13520', border: `1px solid ${muted ? '#d45a5a60' : '#c8f13540'}`, color: muted ? '#d45a5a' : '#c8f135' }}>
                    {muted ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                )}
                <button onClick={hangup}
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: '#d45a5a', color: '#fff' }}>
                  <PhoneOff size={22} />
                </button>
              </>
            )}
            {callState === 'ended' && !showFollowUp && (
              <button onClick={() => { setCallState('idle'); setDuration(0) }}
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: '#c8f135', color: '#0d0e0b' }}>
                <Phone size={22} />
              </button>
            )}
          </div>
        </div>

        {/* Follow-up SMS panel */}
        {callState === 'ended' && showFollowUp && (
          <div className="mx-4 mb-4 rounded-xl overflow-hidden flex flex-col gap-0" style={{ background: '#0d1a0d', border: '1px solid #1e3018' }}>
            <div className="px-4 py-3 flex items-center justify-between border-b border-[#1e3018]">
              <div className="flex items-center gap-2">
                <MessageSquare size={13} style={{ color: '#c8f135' }} />
                <p className="text-xs font-bold" style={{ color: '#c8f135' }}>Send follow-up SMS</p>
              </div>
              {!smsSent && (
                <button onClick={() => { setShowFollowUp(false); setCallState('idle'); setDuration(0) }}
                  className="text-xs" style={{ color: '#3a4a2a' }}>skip</button>
              )}
            </div>

            {smsSent ? (
              <div className="px-4 py-4 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#c8f13530' }}>
                  <Send size={10} style={{ color: '#c8f135' }} />
                </div>
                <p className="text-xs font-bold" style={{ color: '#c8f135' }}>Message sent!</p>
              </div>
            ) : draftMsg ? (
              <div className="flex flex-col gap-0">
                <textarea
                  value={draftMsg}
                  onChange={e => setDraftMsg(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 text-xs font-mono resize-none focus:outline-none"
                  style={{ background: 'transparent', color: '#a0b890', lineHeight: '1.5' }}
                />
                <div className="px-3 py-2.5 flex gap-2 border-t border-[#1e3018]">
                  <button onClick={() => draftFollowUp(tone)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: '#1e2218', color: '#6b7a5a' }}>
                    <RefreshCw size={10} /> Redraft
                  </button>
                  <button onClick={sendFollowUp} disabled={sending}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: '#c8f135', color: '#0d0e0b', opacity: sending ? 0.6 : 1 }}>
                    {sending ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                    {sending ? 'Sending…' : 'Send'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-4 flex flex-col gap-3">
                <p className="text-xs" style={{ color: '#4a5a3a' }}>No answer — send a follow-up with their site link?</p>
                {/* Tone picker */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'warm', label: 'Warm' },
                    { id: 'casual', label: 'Casual' },
                    { id: 'direct', label: 'Direct' },
                    { id: 'corporate', label: 'Corporate' },
                    { id: 'fomo', label: 'Exclusive' },
                  ].map(t => (
                    <button key={t.id} onClick={() => setTone(t.id)}
                      className="px-2.5 py-1 rounded-full text-xs font-bold transition-all"
                      style={{
                        background: tone === t.id ? '#c8f135' : '#1e2218',
                        color: tone === t.id ? '#0d0e0b' : '#4a5a3a',
                        border: `1px solid ${tone === t.id ? '#c8f135' : '#2a3a1a'}`,
                      }}>
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => draftFollowUp(tone)} disabled={drafting}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold"
                    style={{ background: '#c8f135', color: '#0d0e0b', opacity: drafting ? 0.7 : 1 }}>
                    {drafting ? <Loader2 size={12} className="animate-spin" /> : <MessageSquare size={12} />}
                    {drafting ? 'Drafting…' : 'Draft with AI'}
                  </button>
                  <button onClick={() => { setShowFollowUp(false); setCallState('idle'); setDuration(0) }}
                    className="px-4 py-2.5 rounded-lg text-xs font-bold"
                    style={{ background: '#1e2218', color: '#6b7a5a' }}>
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Debug log */}
        {logs.length > 0 && (
          <div className="mx-4 mb-4 rounded-lg overflow-hidden" style={{ background: '#0a0b09', border: '1px solid #1e2218' }}>
            <p className="px-3 py-1.5 text-xs font-bold border-b border-[#1e2218]" style={{ color: '#3a4a2a' }}>Debug log</p>
            <div className="p-2 max-h-28 overflow-y-auto flex flex-col gap-0.5">
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
