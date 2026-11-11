import { useCallback, useEffect, useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { TrialContext } from '../context/TrialContext.jsx'
import TrialModal from '../components/TrialModal.jsx'

const HomeIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" /></svg>
)
const CardIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg>
)

const nav = [
  { to: '/', label: 'Home', end: true, Icon: HomeIcon },
  { to: '/pricing', label: 'Pricing', Icon: CardIcon },
]

// Same sidebar as the Super Admin screens: always visible, navy, orange active item.
function Sidebar() {
  return (
    <div className="flex h-full flex-col bg-navy">
      <div className="px-5 pb-6 pt-7">
        <Link to="/" className="text-3xl font-bold tracking-tight">
          <span className="text-white">Trades</span><span className="text-brand">Dash</span>
        </Link>
      </div>
      <p className="px-5 pb-3 pt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Super Admin</p>
      <nav className="space-y-1 px-2">
        {nav.map(({ to, label, end, Icon }) => (
          <NavLink
            key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium text-white transition ${
                isActive ? 'bg-brand' : 'hover:bg-white/10'
              }`
            }
          >
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-white/10 px-5 py-5 text-sm text-slate-400">TradesDash owner panel</div>
    </div>
  )
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const [trial, setTrial] = useState({ open: false, planId: 'starter' })

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  const openTrial = useCallback((planId) => setTrial({ open: true, planId: planId || 'starter' }), [])
  const closeTrial = useCallback(() => setTrial((t) => ({ ...t, open: false })), [])

  return (
    <TrialContext.Provider value={{ openTrial }}>
      <aside className="fixed inset-y-0 left-0 z-20 w-[248px]"><Sidebar /></aside>

      <div className="ml-[248px] flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b border-line bg-white px-6 py-4">
          <p className="text-xl font-semibold text-navy">TradesDash Control Panel</p>
          <p className="text-sm text-slate-500">Manage every tradesperson business on the platform</p>
        </header>
        <main className="flex-1 p-8"><Outlet /></main>
      </div>

      <TrialModal open={trial.open} planId={trial.planId} onClose={closeTrial} />
    </TrialContext.Provider>
  )
}
