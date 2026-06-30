import { useState, useEffect, useRef } from 'react'
import OnboardingDots from '../components/OnboardingDots'
import { BtnPrimary } from '../components/Btn'

const RING_CIRC = 552.9
const DEMO_SECONDS = 5 * 60
const DEMO_SPEED = 10

function speak(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'es-MX'
  utter.rate = 1.0
  const voices = window.speechSynthesis.getVoices()
  const esVoice = voices.find(v => v.lang.startsWith('es'))
  if (esVoice) utter.voice = esVoice
  window.speechSynthesis.speak(utter)
}

function fmtTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function AlertsDemo({ onNext, onboardingStep }) {
  const [remaining, setRemaining] = useState(DEMO_SECONDS)
  const [coachLine, setCoachLine] = useState('Así sonará cada bloque de tu rutina.')
  const [done, setDone] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    speak('Comienza el tiempo para tomar baño. Tienes 5 minutos.')
    setCoachLine('Actividad iniciada: tomar baño.')

    let rem = DEMO_SECONDS
    const handle = setInterval(() => {
      rem -= 1
      setRemaining(rem)

      if (rem > 0 && rem % 60 === 0) {
        const mins = Math.floor(rem / 60)
        speak(`Quedan ${mins}.`)
        setCoachLine(`Quedan ${mins}.`)
      }

      if (rem <= 0) {
        clearInterval(handle)
        setCoachLine('Así es como te acompañamos en cada bloque.')
        setDone(true)
      }
    }, 1000 / DEMO_SPEED)

    return () => clearInterval(handle)
  }, [])

  const elapsed = 1 - (remaining / DEMO_SECONDS)
  const offset = RING_CIRC * elapsed

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 24
      }}>
        <div style={{ position: 'relative', width: 'min(60vw, 220px)', height: 'min(60vw, 220px)', marginBottom: 22 }}>
          <svg viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            <circle fill="none" stroke="var(--ring-track)" strokeWidth={6} cx={100} cy={100} r={88} />
            <circle fill="none" stroke="var(--amber)" strokeWidth={6} strokeLinecap="round"
              cx={100} cy={100} r={88}
              strokeDasharray={RING_CIRC}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.9s linear' }}
            />
          </svg>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)', textAlign: 'center', width: '70%'
          }}>
            <div style={{ fontSize: 'clamp(2rem,9vw,2.8rem)', fontWeight: 700, lineHeight: 1 }}>
              {fmtTime(Math.max(remaining, 0))}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Tomar baño
            </div>
          </div>
        </div>
        <div style={{ fontSize: '1.05rem', lineHeight: 1.4, textAlign: 'center', color: 'var(--text-primary)', maxWidth: 380 }}>
          {coachLine}
        </div>
      </div>
      <div style={{ padding: '0 28px 32px' }}>
        <BtnPrimary onClick={() => onNext('alerts-config')} disabled={!done}>
          {done ? 'Entendido, continuar' : 'Esperando demo…'}
        </BtnPrimary>
      </div>
    </div>
  )
}
