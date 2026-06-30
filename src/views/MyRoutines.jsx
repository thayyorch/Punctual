import { useState } from 'react'
import { BtnPrimary } from '../components/Btn'

export default function MyRoutines({ routines, catalog, openNewRoutine, openRoutine, deleteRoutine }) {
  const [showMenu, setShowMenu] = useState(false)

  function totalMin(routine) {
    return routine.activityIds.reduce((sum, id) => {
      const a = catalog.find(x => x.id === id)
      return sum + (a ? a.minutes : 0)
    }, 0)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 20px 14px', borderBottom: '1px solid var(--border)'
      }}>
        <h1 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Mis rutinas</h1>
      </div>

      {/* Lista o estado vacío */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 100px' }}>
        {routines.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 70 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'var(--amber-soft-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', margin: '0 auto 20px'
            }}>☀️</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Aún no tienes rutinas.<br />Crea la primera con el botón de abajo.
            </div>
          </div>
        ) : (
          routines.map(routine => (
            <div key={routine.id} onClick={() => openRoutine(routine.id)} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '14px 16px', marginBottom: 10,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              boxShadow: 'var(--card-shadow)', cursor: 'pointer'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{routine.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 2 }}>
                  {routine.activityIds.length} actividades · {totalMin(routine)} min
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); deleteRoutine(routine.id) }} style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: 'var(--text-dim)', width: 28, height: 28, borderRadius: 8,
                fontSize: '0.8rem', cursor: 'pointer'
              }}>✕</button>
            </div>
          ))
        )}
      </div>

      {/* Botón + */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 20px 22px', background: 'linear-gradient(to top, var(--bg) 60%, transparent)' }}>
        <BtnPrimary onClick={() => setShowMenu(true)}>+ Nueva</BtnPrimary>
      </div>

      {/* Menú modal */}
      {showMenu && (
        <div onClick={() => setShowMenu(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(5,6,9,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80, padding: 24
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--bg-card)', borderRadius: 22, padding: 20,
            width: 'min(88vw, 360px)', border: '1px solid var(--border)'
          }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>¿Qué quieres agregar?</div>

            <button onClick={() => { setShowMenu(false); openNewRoutine() }} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, width: '100%',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 16, padding: 14, marginBottom: 10, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left'
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--amber-soft-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>📅</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 2 }}>Rutina</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>Una cadena completa, como "mi mañana": despertar, bañarte, salir.</div>
              </div>
            </button>

            <button onClick={() => setShowMenu(false)} style={{
              background: 'transparent', border: 'none', color: 'var(--text-dim)',
              fontSize: '0.88rem', padding: 8, fontFamily: 'inherit', cursor: 'pointer', width: '100%'
            }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
