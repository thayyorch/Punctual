import OnboardingDots from '../components/OnboardingDots'
import { BtnPrimary } from '../components/Btn'

export default function Welcome({ onNext, onboardingStep }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: '40px 28px', textAlign: 'center'
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        border: '3px solid var(--amber)', borderTopColor: 'transparent',
        marginBottom: 28
      }} />
      <div style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: 14, letterSpacing: '-0.01em' }}>
        Punctual
      </div>
      <div style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.55, maxWidth: 340, marginBottom: 36 }}>
        No es otra alarma. Es <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>una voz que te va guiando bloque por bloque</strong> mientras
        te alistas, para que llegues a tiempo sin tener que ver el celular cada dos minutos.
        <br /><br />
        Configura cuánto te toma cada cosa — o déjanos cronometrarte una vez — y nosotros
        avisamos cuando el tiempo aprieta.
      </div>
      <OnboardingDots step={onboardingStep} />
      <BtnPrimary onClick={() => onNext('philosophy')} style={{ maxWidth: 340 }}>
        Configurar mi rutina
      </BtnPrimary>
    </div>
  )
}
