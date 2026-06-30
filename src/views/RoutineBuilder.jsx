import { useState, useRef, useEffect } from 'react'
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

function fmtMinSec(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function RoutineBuilder({
  editingRoutineId, routines, catalog,
  STANDARD_SUGGESTIONS, saveRoutine, cancelRoutineBuilder,
  addActivityToCatalog, updateActivity,
}) {
  const routine = routines.find(r => r.id === editingRoutineId) || { id: '', name: '', activityIds: [] }
  const [name, setName] = useState(routine.name || '')
  const [activityIds, setActivityIds] = useState(routine.activityIds || [])
  const [showNewActivity, setShowNewActivity] = useState(false)
  const [newActivityLabel, setNewActivityLabel] = useState('')

  // Cronómetro
  const [stopwatchId, setStopwatchId] = useState(null)
  const [swElapsed, setSwElapsed] = useState(0)
  const [swRunning, setSwRunning] = useState(false)
  const [swDone, setSwDone] = useState(false)
  const swRef = useRef(null)

  const activities = activityIds.map(id => catalog.find(a => a.id === id)).filter(Boolean)
  const totalMin = activities.reduce((s, a) => s + a.minutes, 0)

  function addFromSuggestion(sugg) {
    let existing = catalog.find(a => a.label === sugg.label)
    if (!existing) existing = addActivityToCatalog(sugg.label, { ...sugg, custom: false })
    if (!activityIds.includes(existing.id)) setActivityIds(prev => [...prev, existing.id])
  }

  function addFromCatalog(id) {
    if (!activityIds.includes(id)) setActivityIds(prev => [...prev, id])
  }

  function removeActivity(id) {
    setActivityIds(prev => prev.filter(x => x !== id))
  }

  function changeMinutes(id, delta) {
    const a = catalog.find(x => x.id === id)
    if (!a) return
    const next = Math.max(1, a.minutes + delta)
    updateActivity(id, { minutes: next, method: 'estimate' })
  }

  function confirmNewActivity() {
    const label = newActivityLabel.trim()
    if (!label) return
    const capitalised = label.charAt(0).toUpperCase() + label.slice(1)
    const activity = addActivityToCatalog(capitalised, { custom: true })
    setActivityIds(prev => [...prev, activity.id])
    setNewActivityLabel('')
    setShowNewActivity(false)
  }

  // ---- Cronómetro ----
  function openStopwatch(id) {
    setStopwatchId(id)
    setSwElapsed(0)
    setSwRunning(false)
    setSwDone(false)
  }
  function closeStopwatch() {
    clearInterval(swRef.current)
    setStopwatchId(null)
    setSwRunning(false)
    setSwDone(false)
  }
  function toggleStopwatch() {
    if (!swRunning) {
      setSwRunning(true)
      swRef.current = setInterval(() => setSwElapsed(e => e + 1), 1000)
    } else {
      clearInterval(swRef.current)
      setSwRunning(false)
      setSwDone(true)
    }
  }
  function useStopwatchResult() {
    // Colchón mínimo: redondea hacia arriba al minuto siguiente.
    const minutes = Math.ceil(swElapsed / 60) || 1
    updateActivity(stopwatchId, { minutes, method: 'stopwatch', measuredSeconds: swElapsed })
    closeStopwatch()
  }
  useEffect(() => () => clearInterval(swRef.current), [])

  const pendingSuggestions = STANDARD_SUGGESTIONS.filter(s => !catalog.some(a => a.label === s.label))
  const availableFromCatalog = catalog.filter(a => !activityIds.includes(a.id))
  const stopwatchActivity = catalog.find(a => a.id === stopwatchId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Topbar */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
          {routine.name ? 'Editar rutina' : 'Nueva rutina'}
        </h1>
      </div>

      {/* Nombre */}
      <div style={{ padding: '14px 20px 0' }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nombre de la rutina (ej. Mañana entre semana)"
          style={{
            width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            color: 'var(--text-primary)', borderRadius: 11, padding: '13px 14px',
            fontSize: '0.95rem', fontFamily: 'inherit', boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Total en vivo */}
      <div style={{ padding: '10px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Tiempo total de la rutina</span>
        <span style={{ color: 'var(--amber)', fontSize: '1.2rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          {totalMin} min
        </span>
      </div>

      {/* Lista de actividades en la rutina + chips */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 140px' }}>
        {activities.map(a => (
          <div key={a.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                {iconFor(a)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{a.label}</div>
                {a.method === 'stopwatch' && a.measuredSeconds != null && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--triumph)', fontWeight: 600, marginTop: 1 }}>
                    Medido: {fmtMinSec(a.measuredSeconds)}
                  </div>
                )}
              </div>
              <button onClick={() => removeActivity(a.id)} style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: 'var(--text-dim)', width: 26, height: 26, borderRadius: 6,
                fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0
              }}>✕</button>
            </div>

            {/* Stepper de tiempo + cronómetro */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, marginLeft: 46 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                <button onClick={() => changeMinutes(a.id, -1)} style={{ background: 'none', border: 'none', color: 'var(--amber)', fontSize: '1.1rem', fontWeight: 700, width: 32, height: 30, cursor: 'pointer' }}>–</button>
                <div style={{ minWidth: 56, textAlign: 'center', fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{a.minutes} min</div>
                <button onClick={() => changeMinutes(a.id, 1)} style={{ background: 'none', border: 'none', color: 'var(--amber)', fontSize: '1.1rem', fontWeight: 700, width: 32, height: 30, cursor: 'pointer' }}>+</button>
              </div>
              <button onClick={() => openStopwatch(a.id)} style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', borderRadius: 8, padding: '6px 12px',
                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
              }}>⏱ Cronometrar</button>
            </div>
          </div>
        ))}

        {/* Chips para agregar */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '18px 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Agregar a esta rutina
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {availableFromCatalog.map(a => (
            <button key={a.id} onClick={() => addFromCatalog(a.id)} style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', borderRadius: 20, padding: '8px 14px',
              fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
            }}>+ {a.label}</button>
          ))}
          {pendingSuggestions.map(s => (
            <button key={s.label} onClick={() => addFromSuggestion(s)} style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', borderRadius: 20, padding: '8px 14px',
              fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: 0.75
            }}>+ {s.label}</button>
          ))}
          <button onClick={() => setShowNewActivity(true)} style={{
            background: 'var(--bg-elevated)', border: '1.5px dashed var(--border)',
            color: 'var(--text-dim)', borderRadius: 20, padding: '8px 14px',
            fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
          }}>+ Actividad nueva</button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 20px 22px', background: 'linear-gradient(to top, var(--bg) 60%, transparent)' }}>
        <BtnPrimary onClick={() => saveRoutine(routine.id, name, activityIds)} disabled={activityIds.length === 0}>
          Guardar rutina
        </BtnPrimary>
        <BtnGhost onClick={cancelRoutineBuilder}>Cancelar</BtnGhost>
      </div>

      {/* Modal nueva actividad */}
      {showNewActivity && (
        <div onClick={() => setShowNewActivity(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(5,6,9,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80, padding: 24
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--bg-card)', borderRadius: 22, padding: '28px 24px',
            width: 'min(88vw, 360px)', border: '1px solid var(--border)'
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>Nueva actividad</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginBottom: 18 }}>
              Escríbela como debe sonar cuando te avisemos. Ej: "sacar al perro".
            </div>
            <input
              autoFocus type="text" value={newActivityLabel}
              onChange={e => setNewActivityLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmNewActivity()}
              placeholder="ej. sacar al perro"
              style={{
                width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', borderRadius: 11, padding: '13px 14px',
                fontSize: '0.95rem', fontFamily: 'inherit', marginBottom: 16, boxSizing: 'border-box'
              }}
            />
            <BtnPrimary onClick={confirmNewActivity} style={{ marginBottom: 10 }}>Agregar</BtnPrimary>
            <BtnGhost onClick={() => setShowNewActivity(false)}>Cancelar</BtnGhost>
          </div>
        </div>
      )}

      {/* Modal cronómetro */}
      {stopwatchId && (
        <div onClick={closeStopwatch} style={{
          position: 'fixed', inset: 0, background: 'rgba(5,6,9,0.92)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 90, padding: 24
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--bg-card)', borderRadius: 22, padding: '32px 26px',
            width: 'min(88vw, 360px)', border: '1px solid var(--border)', textAlign: 'center'
          }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {stopwatchActivity?.label}
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', margin: '20px 0 26px' }}>
              {fmtMinSec(swElapsed)}
            </div>
            {!swDone ? (
              <BtnPrimary onClick={toggleStopwatch}>{swRunning ? 'Terminé' : 'Empezar'}</BtnPrimary>
            ) : (
              <>
                <div style={{ color: 'var(--triumph)', fontWeight: 600, marginBottom: 14 }}>
                  Tardaste {fmtMinSec(swElapsed)}.
                </div>
                <BtnPrimary onClick={useStopwatchResult} style={{ marginBottom: 10 }}>Usar este tiempo</BtnPrimary>
                <BtnGhost onClick={() => { setSwElapsed(0); setSwDone(false) }}>Medir otra vez</BtnGhost>
              </>
            )}
            <BtnGhost onClick={closeStopwatch}>Cancelar</BtnGhost>
          </div>
        </div>
      )}
    </div>
  )
}
