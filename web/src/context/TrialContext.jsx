import { createContext, useContext } from 'react'

// openTrial(planId) opens the "Start Free Trial" popup from any page.
export const TrialContext = createContext({ openTrial: () => {} })
export const useTrial = () => useContext(TrialContext)
