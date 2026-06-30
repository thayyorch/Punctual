import { useEffect, useRef, useState } from 'react'

const RING_CIRC = 552.9

function fmtTime(s) {
  const m = Math.floor(Math.max(s, 0) / 60)
  const sec = Math.max(s, 0) % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function useAudio() {
  const ctxRef = useRef(null)
  function getCtx() {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    return ctxRef.current
  }
  function tone(freq, duration, delay = 0, type = 'sine', peak = 0.18) {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      osc.connect(gain)
      gain.connect(ctx.destination)
      const t0 = ctx.currentTime + delay
      gain.gain.setValueAtTime(0, t0)
      gain.gain.linearRampToValueAtTime(peak, t0 + 0.03)
      gain.gain.linearRampToValueAtTime(0, t0 + duration)
      osc.start(t0)
      osc.stop(t0 + duration + 0.05)
    } catch (_) {}
  }
  return {
    chime: () => { tone(880, 0.18); tone(1175, 0.22, 0.16) },
    triumph: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, i * 0.11, 'triangle', 0.16)),
    wakeAlarm: () => { tone(660, 0.4, 0, 'square', 0.12); tone(660, 0.4, 0.55, 'square', 0.12) },
    urgentBeep: () => tone(720, 0.25, 0, 'sawtooth', 0.14),
  }
}

function useSpeech() {
  const voiceRef = useRef(null)
  useEffect(() => {
    function pick() {
      const voices = window.speechSynthesis?.getVoices() || []
      voiceRef.current = voices.find(v => v.lang.startsWith('es')) || voices[0] || null
    }
    pick()
    window.speechSynthesis?.addEventListener('voiceschanged', pick)
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', pick)
  }, [])

  return function speak(text, interrupt = false) {
    const synth = window.speechSynthesis
    if (!synth) return
    if (interrupt) synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'es-MX'
    if (voiceRef.current) u.voice = voiceRef.current
    u.rate = 1.0
    synth.speak(u)
  }
}

export default function Execution({ routines, catalog, editingRoutineId, globalInterval, onFinish }) {
  const routine = routines.find(r => r.id === editingRoutineId)
  const blocks = (routine?.activityIds || [])
    .map(id => catalog.find(a => a.id === id))
    .filter(Boolean)
    .map(a => ({ ...a, seconds: a.minutes * 60, announceEvery: globalInterval * 60 }))

  const [blockIdx, setBlockIdx] = useState(0)
  const [remaining, setRemaining] = useState(blocks[0]?.seconds || 0)
  const [phase, setPhase] = useState('normal') // 'normal' | 'transition' | 'urgent' | 'done'
  const [coachText, setCoachText] = useState('Preparando tu rutina…')
  const [extensionUsed, setExtensionUsed] = useState(false)
  const [blockSeconds, setBlockSeconds] = useState(blocks.map(b => b.seconds))
  const [toast, setToast] = useState(null)
  const logRef = useRef([]) // { label, extended, finishedEarly, savedSeconds }

  const timerRef = useRef(null)
  const urgentRef = useRef(null)
  const audio = useAudio()
  const speak = useSpeech()

  const block = blocks[blockIdx]
  const curSeconds = blockSeconds[blockIdx] || block?.seconds || 0
  const elapsed = curSeconds - remaining
  const ringOffset = RING_CIRC * (elapsed / curSeconds)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2600)
  }

  function coach(text, interrupt = true) {
    setCoachText(text)
    speak(text, interrupt)
  }

  // Inicia un bloque por índice
  function startBlock(idx, updatedBlockSeconds) {
    const secs = (updatedBlockSeconds || blockSeconds)[idx]
    const b = blocks[idx]
    if (!b) return

    clearInterval(timerRef.current)
    clearInterval(urgentRef.current)
    setBlockIdx(idx)
    setRemaining(secs)
    setPhase('normal')
    setExtensionUsed(false)

    logRef.current.push({ label: b.label, extended: false, finishedEarly: false, savedSeconds: 0 })

    if (b.isWakeBlock) {
      audio.wakeAlarm()
      coach(`La alarma está sonando. Tienes ${Math.floor(secs / 60)} minutos para levantarte.`)
    } else {
      audio.chime()
      coach(`Comienza ${b.speech || b.label.toLowerCase()}. Tienes ${Math.floor(secs / 60)} minutos.`)
    }

    timerRef.current = setInterval(() => tick(idx, updatedBlockSeconds), 1000)
  }

  // Referencia mutable para remaining y phase (evitar stale closure)
  const stateRef = useRef({ remaining, phase, extensionUsed, blockSeconds })
  useEffect(() => { stateRef.current = { remaining, phase, extensionUsed, blockSeconds } }, [remaining, phase, extensionUsed, blockSeconds])

  function tick(idx, updatedBlockSeconds) {
    setRemaining(prev => {
      const b = blocks[idx]
      const secs = (updatedBlockSeconds || stateRef.current.blockSeconds)[idx]
      const next = prev - 1

      if (next < 0) {
        clearInterval(timerRef.current)
        handleTimeout(idx)
        return 0
      }

      // Anuncios periódicos bloque normal
      if (!b.isWakeBlock && stateRef.current.phase === 'normal') {
        const interval = b.announceEvery
        if (next > 60 && next % interval === 0) {
          const mins = Math.floor(next / 60)
          const msg = `Quedan ${mins}.`
          setCoachText(msg)
          speak(msg)
        }
        // Ventana de transición: último minuto
        if (next === 60) {
          enterTransition(idx)
        }
      }

      // Bloque de despertar: avisos y modo urgente
      if (b.isWakeBlock) {
        if (next === 120 && stateRef.current.phase === 'normal') enterUrgent()
        if (!stateRef.current.phase.includes('urgent') && (next === 240 || next === 180)) {
          const mins = Math.ceil(next / 60)
          const msg = `Quedan ${mins} minutos para levantarte.`
          setCoachText(msg)
          speak(msg)
        }
      }

      return next
    })
  }

  function enterTransition(idx) {
    setPhase('transition')
    const next = blocks[idx + 1]
    const nextName = next ? (next.speech || next.label.toLowerCase()) : 'salir'
    coach(`Un minuto. Después, ${nextName}.`)
  }

  function enterUrgent() {
    setPhase('urgent')
    audio.urgentBeep()
    coach('Levántate. Ya es hora.')
    urgentRef.current = setInterval(() => {
      audio.urgentBeep()
      coach('Levántate. Ya es hora.')
    }, 4500)
  }

  function handleTimeout(idx) {
    clearInterval(urgentRef.current)
    const next = idx + 1
    if (next >= blocks.length) {
      finishRoutine()
    } else {
      const b = blocks[next]
      coach(`Tiempo. Ahora, ${b.speech || b.label.toLowerCase()}.`)
      setTimeout(() => startBlock(next), 1500)
    }
  }

  function grantExtra() {
    if (extensionUsed) return
    setExtensionUsed(true)
    const entry = logRef.current[logRef.current.length - 1]
    if (entry) entry.extended = true
    const extra = 2 * 60
    setRemaining(prev => prev + extra)
    setBlockSeconds(prev => {
      const updated = [...prev]
      updated[blockIdx] = updated[blockIdx] + extra
      return updated
    })
    setPhase('normal')
    coach('Listo, 2 minutos más.')
    showToast('+2 min agregados')
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => tick(blockIdx), 1000)
  }

  function finishEarly() {
    clearInterval(timerRef.current)
    const savedSec = remaining
    const savedMin = Math.floor(savedSec / 60)
    const entry = logRef.current[logRef.current.length - 1]
    if (entry) { entry.finishedEarly = true; entry.savedSeconds = savedSec }
    audio.triumph()
    if (savedMin >= 1) {
      coach(`Bien. Ganaste ${savedMin} minutos.`)
      showToast(`+${savedMin} min ganados`)
    } else {
      coach('Justo a tiempo.')
    }
    setTimeout(() => {
      const next = blockIdx + 1
      if (next >= blocks.length) finishRoutine()
      else startBlock(next)
    }, 1800)
  }

  function wakeConfirm() {
    clearInterval(timerRef.current)
    clearInterval(urgentRef.current)
    const next = blockIdx + 1
    if (next >= blocks.length) finishRoutine()
    else startBlock(next)
  }

  function finishRoutine() {
    setPhase('done')
    coach('Saliste a tiempo.')
    audio.triumph()
    setTimeout(() => onFinish(logRef.current), 2000)
  }

  // Arrancar al montar
  useEffect(() => {
    if (blocks.length > 0) startBlock(0, blockSeconds)
    return () => { clearInterval(timerRef.current); clearInterval(urgentRef.current) }
  }, []) // eslint-disable-line

  const ringColor = phase === 'urgent' ? 'var(--urgent)'
    : phase === 'done' || (phase === 'normal' && remaining === 0) ? 'var(--triumph)'
    : 'var(--amber)'

  const nextBlock = blocks[blockIdx + 1]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      background: phase === 'urgent' ? 'radial-gradient(ellipse at center, var(--urgent-soft-bg) 0%, var(--bg) 75%)' : 'var(--bg)',
      transition: 'background 0.6s ease'
    }}>
      {/* Ring */}
      <div style={{ position: 'relative', width: 'min(70vw, 280px)', height: 'min(70vw, 280px)', marginBottom: 32 }}>
        <svg viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
          <circle cx="100" cy="100" r="88" fill="none" stroke="var(--ring-track)" strokeWidth="6" />
          <circle
            cx="100" cy="100" r="88" fill="none"
            stroke={ringColor}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={RING_CIRC}
            strokeDashoffset={RING_CIRC - ringOffset}
            style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.6s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', width: '70%' }}>
          <div style={{ fontSize: 'clamp(2.4rem,11vw,3.4rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {fmtTime(remaining)}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
            {block?.label || '—'}
          </div>
        </div>
      </div>

      {/* Coach line */}
      <div style={{
        minHeight: 56, maxWidth: 380, textAlign: 'center', fontSize: '1.05rem',
        lineHeight: 1.4, color: phase === 'urgent' ? 'var(--urgent)' : 'var(--text-primary)',
        marginBottom: 28, fontWeight: phase === 'urgent' ? 600 : 450
      }}>
        {coachText}
      </div>

      {/* Siguiente actividad */}
      {nextBlock && (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: 18 }}>
          Siguiente: {nextBlock.label}, {nextBlock.minutes} min
        </div>
      )}

      {/* Botones de acción */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {block?.isWakeBlock ? (
          <button onClick={wakeConfirm} style={{
            background: 'var(--amber)', color: '#1A1305', fontSize: '1.05rem', fontWeight: 600,
            padding: '17px 28px', borderRadius: 16, border: 'none', cursor: 'pointer',
            width: 'min(85vw, 300px)'
          }}>Ya me levanté</button>
        ) : (
          <>
            <button onClick={finishEarly} style={{
              background: 'var(--amber)', color: '#1A1305', fontSize: '1.05rem', fontWeight: 600,
              padding: '17px 28px', borderRadius: 16, border: 'none', cursor: 'pointer',
              width: 'min(85vw, 300px)'
            }}>Terminé antes</button>
            {phase === 'transition' && !extensionUsed && (
              <button onClick={grantExtra} style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', borderRadius: 22, padding: '11px 22px',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}>⏱️ Agregar 2 min</button>
            )}
          </>
        )}
      </div>

      {/* Interval tag */}
      {!block?.isWakeBlock && (
        <div style={{ marginTop: 24, fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          🔔 Avisos cada {globalInterval} min
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 28, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--bg-elevated)', border: '1px solid var(--amber-dim)',
          borderRadius: 14, padding: '14px 22px', fontSize: '0.9rem', zIndex: 70,
          whiteSpace: 'nowrap'
        }}>{toast}</div>
      )}
    </div>
  )
}
