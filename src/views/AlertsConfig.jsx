import OnboardingDots from '../components/OnboardingDots'
import { BtnPrimary } from '../components/Btn'

export default function AlertsConfig({ onNext, onboardingStep, globalInterval, setGlobalInterval }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center'
      }}>
        <div style={{
          fontSize: '0.78rem', color: 'var(--amber)', textTransform: 'uppercase',
          letterSpacing: '0.08em', fontWeight: 700, marginBottom: 20
        }}>
          Avisos continuos
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.45, maxWidth: 340 }}>
          Te ayudamos a saber cuánto tiempo te queda, con avisos continuos.
        </div>
        <div style={{
          fontSize: '1rem', color: 'var(--text-dim)', lineHeight: 1.55,
          maxWidth: 320, marginTop: 16, marginBottom: 28
        }}>
          Tú decides cada cuánto quieres escucharlos. Aplica para toda tu rutina.
        </div>
        <div style={{ display: 'flex', gap: 8, maxWidth: 300, width: '100%' }}>
          {[1, 2].map(n => (
            <button key={n} onClick={() => setGlobalInterval(n)} style={{
              flex: 1, background: globalInterval === n ? 'var(--amber-soft-bg)' : 'var(--bg-elevated)',
              border: `1px solid ${globalInterval === n ? 'var(--amber)' : 'var(--border)'}`,
              color: globalInterval === n ? 'var(--amber)' : 'var(--text-dim)',
              borderRadius: 8, padding: '10px 4px', fontSize: '0.85rem',
              fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
            }}>
              Cada {n} minuto{n === 2 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 28px 32px' }}>
        <OnboardingDots step={onboardingStep} />
        <BtnPrimary onClick={() => onNext('concepts')}>Continuar</BtnPrimary>
      </div>
    </div>
  )
}
