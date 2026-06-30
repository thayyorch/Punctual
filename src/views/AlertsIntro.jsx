import OnboardingDots from '../components/OnboardingDots'
import { BtnPrimary } from '../components/Btn'

export default function AlertsIntro({ onNext, onboardingStep }) {
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
          Cómo te avisamos
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.45, maxWidth: 340 }}>
          Un cronómetro simple no basta.
        </div>
        <div style={{
          fontSize: '1rem', color: 'var(--text-dim)', lineHeight: 1.55,
          maxWidth: 320, marginTop: 16
        }}>
          Te ayudamos a ser consciente del tiempo cuando transcurre — no solo cuando ya se acabó.
        </div>
      </div>
      <div style={{ padding: '0 28px 32px' }}>
        <OnboardingDots step={onboardingStep} />
        <BtnPrimary onClick={() => onNext('alerts-demo')}>Ver cómo suena</BtnPrimary>
      </div>
    </div>
  )
}
