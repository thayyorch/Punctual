import { BtnPrimary, BtnGhost } from '../components/Btn'

function iconFor(activity) {
  const t = (activity.label || '').toLowerCase()
  if (activity.isWakeBlock || t.includes('levant')) return '⏰'
  if (t.includes('baño') || t.includes('duch')) return '🚿'
  if (t.includes('vest') || t.includes('arregl')) return '👕'
  if (t.includes('desayun') || t.includes('comer')) return '🍳'
  if (t.includes('salir') || t.includes('puerta')) return '🚪'
  if (t.includes('perro') || t.includes('mascota')) return '🐕'
  return '⏱️'
}

export default function Summary({ routines, catalog, editingRoutineId, globalInterval, onNext, setEditingRoutineId, setBuilderReturnsTo, startExecution }) {
  const routine = routines.find(r => r.id === editingRoutineId)
  if (!routine) return null

  const activities = routine.activityIds
    .map(id => catalog.find(a => a.id === id))
    .filter(Boolean)

  const totalMin = activities.reduce((s, a) => s + a.minutes, 0)

  function goEdit() {
    setBuilderReturnsTo('summary')
    onNext('routine-builder')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 14px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{routine.name || 'Resumen de tu rutina'}</h1>
      </div>

      {/* Lista de actividades */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 120px' }}>
        {activities.map(a => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
              {iconFor(a)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{a.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 1 }}>
                {a.method === 'stopwatch' ? 'Medido con cronómetro' : 'Estimado'}
              </div>
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 600, flexShrink: 0 }}>
              {a.minutes} min
            </div>
          </div>
        ))}

        {/* Total */}
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: '2px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
          <span>Tiempo total</span>
          <span>{totalMin} min</span>
        </div>

        {/* Info de avisos */}
        <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--amber-soft-bg)', borderRadius: 12, fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          🔔 Avisos cada <strong style={{ color: 'var(--text-primary)' }}>{globalInterval} minuto{globalInterval > 1 ? 's' : ''}</strong>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 20px 22px', background: 'linear-gradient(to top, var(--bg) 60%, transparent)' }}>
        <BtnPrimary onClick={startExecution} disabled={activities.length === 0}>
          Activar rutina
        </BtnPrimary>
        <BtnGhost onClick={goEdit}>Ajustar actividades</BtnGhost>
      </div>
    </div>
  )
}
