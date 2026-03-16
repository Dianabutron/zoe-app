import { useState, useEffect } from 'react'
import ZoeOnboarding from './ZoeOnboarding.jsx'
import ZoeApp from './ZoeApp.jsx'

function App() {
  const [onboarded, setOnboarded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = window.localStorage?.getItem('zoe_onboarded')
      if (saved === 'true') setOnboarded(true)
    } catch {}
    setLoading(false)
  }, [])

  function handleOnboardingComplete() {
    try { window.localStorage?.setItem('zoe_onboarded', 'true') } catch {}
    setOnboarded(true)
  }

  if (loading) return null

  if (!onboarded) {
    return <ZoeOnboarding onComplete={handleOnboardingComplete} />
  }

  return <ZoeApp />
}

export default App
