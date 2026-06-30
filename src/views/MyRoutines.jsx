export default function MyRoutines() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 20px 14px', borderBottom: '1px solid var(--border)'
      }}>
        <h1 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Mis rutinas</h1>
      </div>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center'
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'var(--amber-soft-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', margin: '0 auto 20px'
        }}>☀️</div>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Aún no tienes rutinas.<br />Crea la primera con el botón de abajo.
        </div>
      </div>
      <div style={{ padding: '14px 20px 22px' }}>
        <button style={{
          border: 'none', borderRadius: 16, fontFamily: 'inherit', fontWeight: 600,
          cursor: 'pointer', background: 'var(--amber)', color: '#1A1305',
          fontSize: '1.05rem', padding: '17px 28px', width: '100%'
        }}>
          + Nueva
        </button>
      </div>
    </div>
  )
}
