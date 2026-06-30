import { BtnPrimary } from '../components/Btn'

export default function Report({ blockLog, onDone }) {
  const extended = blockLog.filter(b => b.extended)
  const early = blockLog.filter(b => b.finishedEarly && b.savedSeconds >= 60)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Topbar */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Cómo te fue hoy</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 120px' }}>
        {extended.length === 0 && early.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>Saliste a tiempo</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Seguiste el plan al pie de la letra.<br />Mañana igual.
            </div>
          </div>
        ) : (
          <>
            {early.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--triumph)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 10 }}>
                  ⚡ Tiempo ganado
                </div>
                {early.map(b => (
                  <div key={b.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 600 }}>{b.label}</span>
                    <span style={{ color: 'var(--triumph)', fontWeight: 700 }}>+{Math.floor(b.savedSeconds / 60)} min</span>
                  </div>
                ))}
              </div>
            )}

            {extended.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 10 }}>
                  ⏱ Tiempo extra pedido
                </div>
                {extended.map(b => (
                  <div key={b.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 600 }}>{b.label}</span>
                    <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>+2 min</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 20px 22px', background: 'linear-gradient(to top, var(--bg) 60%, transparent)' }}>
        <BtnPrimary onClick={onDone}>Listo</BtnPrimary>
      </div>
    </div>
  )
}
