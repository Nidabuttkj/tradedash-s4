import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { plans as fallbackPlans } from '../data/plans.js'

// Shows the fallback plans first, then replaces them with the backend's plans.
export default function usePlans() {
  const [plans, setPlans] = useState(fallbackPlans)
  useEffect(() => {
    let alive = true
    api('/api/public/plans')
      .then((data) => alive && Array.isArray(data) && data.length && setPlans(data))
      .catch(() => {}) // backend off: keep fallback plans
    return () => { alive = false }
  }, [])
  return plans
}
