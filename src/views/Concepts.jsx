import OnboardingDots from '../components/OnboardingDots'
import { BtnPrimary } from '../components/Btn'

export default function Concepts({ finishOnboarding, onboardingStep }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center'
      }}>
        <div style={{
          fontSize: '0.78rem', color: 'var(--amber)', textTransform: 'uppercase',
          letterSpacing: '0.08em', fontWeight: 700, marginBottom: 24
        }}>
          Dos palabras que vas a usar
        </div>

        {/* Una actividad */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: 'var(--bg-card)',
            border: '1.5px solid var(--amber)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.4rem'
          }}>🚿</div>
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>Una actividad</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: 280, marginBottom: 28 }}>
          Una sola cosa que haces. Bañarte. Sacar al perro. Desayunar.
        </div>

        {/* Una rutina */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          {['⏰', '🚿', '👕', '🚪'].map((icon, i) => (
            <>
              <div key={icon} style={{
                width: 40, height: 40, borderRadius: 10, background: 'var(--bg-card)',
                border: `1.5px solid ${i === 3 ? 'var(--amber)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
              }}>{icon}</div>
              {i < 3 && <div style={{ width: 14, height: 2, background: 'var(--text-dim)' }} />}
            </>
          ))}
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>Una rutina</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: 280 }}>
          La cadena de actividades, en orden. Tu mañana. Tu noche. Lo que quieras armar.
        </div>
      </div>
      <div style={{ padding: '0 28px 32px' }}>
        <OnboardingDots step={onboardingStep} />
        <BtnPrimary onClick={finishOnboarding}>Empezar</BtnPrimary>
      </div>
    </div>
  )
}
