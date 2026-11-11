import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import usePlans from '../hooks/usePlans.js'
import { Button } from './ui.jsx'

const trades = ['Plumber', 'Electrician', 'Gas engineer', 'Roofer', 'Other']
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
// Names: letters, spaces, apostrophe, dot and hyphen only (no numbers)
const badNameChars = /[^\p{L}\s'.-]/gu
const nameOk = (n) => /^\p{L}[\p{L}\s'.-]*$/u.test(n)
// The email box shows "@gmail.com" automatically. Typing a full address with "@" still works.
const fullEmailOf = (v) => {
  const t = v.trim()
  return !t ? '' : t.includes('@') ? t : `${t}@gmail.com`
}

// Popup form for "Start Free Trial". Calls POST /api/public/trial-signup.
export default function TrialModal({ open, planId, onClose }) {
  const navigate = useNavigate()
  const plans = usePlans()
  const first = useRef(null)
  const emailRef = useRef(null)
  const [form, setForm] = useState({ businessName: '', ownerName: '', email: '', trade: 'Plumber', planId: 'starter' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  // Each time the popup opens: reset the form and pick the plan that was clicked
  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, planId: planId || 'starter' }))
      setErrors({}); setServerError('')
      setTimeout(() => first.current?.focus(), 50)
    }
  }, [open, planId])

  // Esc closes the popup
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    const found = {}
    if (!form.businessName.trim()) found.businessName = 'Business name is required'
    if (!form.ownerName.trim()) found.ownerName = 'Your name is required'
    else if (!nameOk(form.ownerName.trim())) found.ownerName = 'Name can only contain letters'
    const email = fullEmailOf(form.email)
    if (!emailOk(email)) found.email = 'Enter a valid email'
    setErrors(found); setServerError('')
    if (Object.keys(found).length) return

    setLoading(true)
    try {
      const data = await api('/api/public/trial-signup', { method: 'POST', body: JSON.stringify({ ...form, email }) })
      onClose()
      navigate(data.redirectTo || '/dashboard', { state: { tenant: data.tenant } })
    } catch (err) {
      if (err.data?.errors) setErrors(err.data.errors)
      else if (err.status === 429) setServerError(err.data?.error || 'Too many attempts. Please wait a few minutes.')
      else if (err.status) setServerError('Something went wrong on our side. Please try again in a moment.')
      else setServerError('Could not reach the server. Start the backend (npm run dev in the server folder) and try again.')
    } finally {
      setLoading(false)
    }
  }

  const input = (key, label, type = 'text', ref) => (
    <div>
      <label htmlFor={`trial-${key}`} className="mb-1 block text-sm font-medium text-navy">{label}</label>
      <input
        id={`trial-${key}`} ref={ref} type={type} value={form[key]} onChange={set(key)}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand/50 ${errors[key] ? 'border-red-500' : 'border-line'}`}
      />
      {errors[key] && <p className="mt-1 text-sm text-red-600">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        onSubmit={submit} noValidate role="dialog" aria-modal="true" aria-labelledby="trial-title"
        className="max-h-full w-full max-w-md space-y-4 overflow-y-auto rounded-2xl border-t-4 border-t-brand bg-white p-7 shadow-card"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 id="trial-title" className="text-2xl font-medium text-navy">Start your free trial</h2>
            <p className="mt-1 text-sm text-slate-500">14 days free. No card needed.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-slate-400 hover:text-navy">×</button>
        </div>

        {input('businessName', 'Business name', 'text', first)}

        <div>
          <label htmlFor="trial-ownerName" className="mb-1 block text-sm font-medium text-navy">Your name</label>
          <input
            id="trial-ownerName" type="text" autoComplete="name" value={form.ownerName}
            onChange={(e) => setForm({ ...form, ownerName: e.target.value.replace(badNameChars, '') })}
            className={`w-full rounded-lg border bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand/50 ${errors.ownerName ? 'border-red-500' : 'border-line'}`}
          />
          {errors.ownerName && <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>}
        </div>

        <div>
          <label htmlFor="trial-email" className="mb-1 block text-sm font-medium text-navy">Email</label>
          <div
            onClick={() => emailRef.current?.focus()}
            className={`flex cursor-text items-center rounded-lg border bg-white px-3 focus-within:ring-2 focus-within:ring-brand/50 ${errors.email ? 'border-red-500' : 'border-line'}`}
          >
            <input
              id="trial-email" ref={emailRef} type="text" inputMode="email" autoComplete="off" placeholder="yourname"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value.replace(/\s/g, '') })}
              style={form.email.includes('@') ? undefined : { width: `${Math.max(form.email.length, 8)}ch` }}
              className={`min-w-0 bg-transparent py-2.5 outline-none ${form.email.includes('@') ? 'flex-1' : 'max-w-full'}`}
            />
            {!form.email.includes('@') && <span className="select-none py-2.5 text-slate-400">@gmail.com</span>}
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="trial-trade" className="mb-1 block text-sm font-medium text-navy">Your trade</label>
            <select id="trial-trade" value={form.trade} onChange={set('trade')} className="w-full rounded-lg border border-line bg-white px-3 py-2.5">
              {trades.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="trial-plan" className="mb-1 block text-sm font-medium text-navy">Plan</label>
            <select id="trial-plan" value={form.planId} onChange={set('planId')} className="w-full rounded-lg border border-line bg-white px-3 py-2.5">
              {plans.map((p) => <option key={p.id} value={p.id}>{p.name} (£{p.monthly})</option>)}
            </select>
          </div>
        </div>

        {serverError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}
        <Button type="submit" disabled={loading} className="w-full py-3">
          {loading ? 'Creating your account…' : 'Start Free Trial'}
        </Button>
      </form>
    </div>
  )
}
