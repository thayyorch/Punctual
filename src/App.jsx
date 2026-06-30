import { useState, useEffect } from 'react'
import Welcome from './views/Welcome'
import Philosophy from './views/Philosophy'
import AlertsIntro from './views/AlertsIntro'
import AlertsDemo from './views/AlertsDemo'
import AlertsConfig from './views/AlertsConfig'
import Concepts from './views/Concepts'
import MyRoutines from './views/MyRoutines'
import RoutineBuilder from './views/RoutineBuilder'

const ONBOARDING_VIEWS = ['welcome', 'philosophy', 'alerts-intro', 'alerts-demo', 'alerts-config', 'concepts']

const STANDARD_SUGGESTIONS = [
  { label: 'Levantarte',            minutes: 5,  isWakeBlock: true,  speech: 'levantarte' },
  { label: 'Usar el baño',          minutes: 8,  isWakeBlock: false, speech: 'usar el baño' },
  { label: 'Tomar un baño',         minutes: 15, isWakeBlock: false, speech: 'tomar un baño' },
  { label: 'Vestirte / arreglarte', minutes: 14, isWakeBlock: false, speech: 'arreglarte' },
  { label: 'Desayunar / comer',     minutes: 20, isWakeBlock: false, speech: 'desayunar' },
  { label: 'Salir de casa',         minutes: 5,  isWakeBlock: false, speech: 'salir de casa' },
]

let idCounter = 1
function newId(prefix) { return `${prefix}_${idCounter++}` }

export default function App() {
  const [view, setView] = useState('welcome')
  const [globalInterval, setGlobalInterval] = useState(2)
  const [catalog, setCatalog] = useState([])     // ActivityCatalog global
  const [routines, setRoutines] = useState([])   // lista de rutinas
  const [editingRoutineId, setEditingRoutineId] = useState(null)
  const [builderReturnsTo, setBuilderReturnsTo] = useState('my-routines')

  useEffect(() => {
    const done = localStorage.getItem('punctual_onboarding_done')
    if (done) setView('my-routines')
  }, [])

  function finishOnboarding() {
    localStorage.setItem('punctual_onboarding_done', 'true')
    setView('my-routines')
  }

  function openNewRoutine() {
    const id = newId('routine')
    const routine = { id, name: '', activityIds: [] }
    setRoutines(prev => [...prev, routine])
    setEditingRoutineId(id)
    setBuilderReturnsTo('my-routines')
    setView('routine-builder')
  }

  function saveRoutine(routineId, name, activityIds) {
    setRoutines(prev => prev.map(r =>
      r.id === routineId ? { ...r, name: name || 'Rutina sin nombre', activityIds } : r
    ))
    setView(builderReturnsTo === 'my-routines' ? 'my-routines' : 'my-routines')
  }

  function cancelRoutineBuilder() {
    // si es nueva rutina, eliminarla
    if (builderReturnsTo === 'my-routines') {
      setRoutines(prev => prev.filter(r => r.id !== editingRoutineId))
    }
    setView('my-routines')
  }

  function deleteRoutine(id) {
    setRoutines(prev => prev.filter(r => r.id !== id))
  }

  function addActivityToCatalog(label, options = {}) {
    const id = newId('act')
    const activity = {
      id, label,
      speech: options.speech || null,
      isWakeBlock: options.isWakeBlock || false,
      custom: options.custom !== false,
      minutes: options.minutes || 10,
      method: 'estimate',
      measuredSeconds: null,
    }
    setCatalog(prev => [...prev, activity])
    return activity
  }

  function updateActivity(id, changes) {
    setCatalog(prev => prev.map(a => a.id === id ? { ...a, ...changes } : a))
  }

  const onboardingStep = ONBOARDING_VIEWS.indexOf(view)

  const shared = {
    onNext: setView,
    globalInterval, setGlobalInterval,
    finishOnboarding,
    onboardingStep,
    catalog, setCatalog,
    routines, setRoutines,
    editingRoutineId,
    STANDARD_SUGGESTIONS,
    openNewRoutine,
    saveRoutine,
    cancelRoutineBuilder,
    deleteRoutine,
    addActivityToCatalog,
    updateActivity,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' }}>
      {view === 'welcome'          && <Welcome {...shared} />}
      {view === 'philosophy'       && <Philosophy {...shared} />}
      {view === 'alerts-intro'     && <AlertsIntro {...shared} />}
      {view === 'alerts-demo'      && <AlertsDemo {...shared} />}
      {view === 'alerts-config'    && <AlertsConfig {...shared} />}
      {view === 'concepts'         && <Concepts {...shared} />}
      {view === 'my-routines'      && <MyRoutines {...shared} />}
      {view === 'routine-builder'  && <RoutineBuilder {...shared} />}
    </div>
  )
}
