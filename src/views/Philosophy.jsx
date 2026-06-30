import OnboardingDots from '../components/OnboardingDots'
import { BtnPrimary } from '../components/Btn'

export default function Philosophy({ onNext, onboardingStep }) {
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
          Una idea, antes de empezar
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.4, maxWidth: 340 }}>
          La puntualidad no está en cuánto tardas en llegar a tu cita.
        </div>
        <div style={{
          fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.4,
          maxWidth: 340, color: 'var(--amber)', marginTop: 10
        }}>
          Está en cuándo te levantas — muchos minutos antes de salir.
        </div>
      </div>
      <div style={{ padding: '0 28px 32px' }}>
        <OnboardingDots step={onboardingStep} />
        <BtnPrimary onClick={() => onNext('alerts-intro')}>Entendido</BtnPrimary>
      </div>
    </div>
  )
}
