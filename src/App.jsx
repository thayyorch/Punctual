import { useState, useEffect } from 'react'
import Welcome from './views/Welcome'
import Philosophy from './views/Philosophy'
import AlertsIntro from './views/AlertsIntro'
import AlertsDemo from './views/AlertsDemo'
import AlertsConfig from './views/AlertsConfig'
import Concepts from './views/Concepts'
import MyRoutines from './views/MyRoutines'

const ONBOARDING_VIEWS = ['welcome', 'philosophy', 'alerts-intro', 'alerts-demo', 'alerts-config', 'concepts']

export default function App() {
  const [view, setView] = useState('welcome')
  const [globalInterval, setGlobalInterval] = useState(2)

  useEffect(() => {
    const done = localStorage.getItem('punctual_onboarding_done')
    if (done) setView('my-routines')
  }, [])

  function finishOnboarding() {
    localStorage.setItem('punctual_onboarding_done', 'true')
    setView('my-routines')
  }

  const onboardingStep = ONBOARDING_VIEWS.indexOf(view)

  const props = {
    onNext: (next) => setView(next),
    globalInterval,
    setGlobalInterval,
    finishOnboarding,
    onboardingStep,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' }}>
      {view === 'welcome'       && <Welcome {...props} />}
      {view === 'philosophy'    && <Philosophy {...props} />}
      {view === 'alerts-intro'  && <AlertsIntro {...props} />}
      {view === 'alerts-demo'   && <AlertsDemo {...props} />}
      {view === 'alerts-config' && <AlertsConfig {...props} />}
      {view === 'concepts'      && <Concepts {...props} />}
      {view === 'my-routines'   && <MyRoutines {...props} />}
    </div>
  )
}
