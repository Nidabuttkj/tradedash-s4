import { useState } from 'react'
import { PageHeader, StatCard, Panel, Button, Badge, Table } from '../components/ui.jsx'
import { useTrial } from '../context/TrialContext.jsx'
import { features, steps, quotes } from '../data/content.js'

const tabs = ['All', 'Quotes', 'Jobs', 'Payments', 'Certificates']
const planFilters = ['All plans', 'Starter and Pro', 'Pro only']

export default function Home() {
  const { openTrial } = useTrial()
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('All plans')

  const matches = (f) => {
    const q = search.trim().toLowerCase()
    const okSearch = !q || [f.name, f.text, f.cat].some((x) => x.toLowerCase().includes(q))
    const okPlan = planFilter === 'All plans' || (planFilter === 'Pro only' ? f.plan === 'Pro' : f.plan === 'All plans')
    return okSearch && okPlan
  }
  const rows = features.filter((f) => (tab === 'All' || f.cat === tab) && matches(f))
  const count = (t) => features.filter((f) => (t === 'All' || f.cat === t) && matches(f)).length

  const field = 'rounded-lg border border-line bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand/40'

  return (
    <>
      <PageHeader title="Home" subtitle="Run your whole trades business from your phone">
        <Button onClick={() => openTrial()} className="!px-6 !py-3 text-sm">Start Free Trial</Button>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-3">
        <StatCard label="Quote to cash" value="3 steps" note="Record, send, get paid" tone="navy" />
        <StatCard label="Customer approval" value="1 tap" note="Quotes approved on WhatsApp" tone="brand" />
        <StatCard label="Free trial" value="14 days" note="No card needed to start" tone="red" />
      </div>

      <Panel
        title="What TradesDash does" className="mt-8"
        right={
          <div className="flex flex-wrap gap-3">
            <input
              value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search features"
              placeholder="Search feature, area..." className={`${field} w-64`}
            />
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} aria-label="Filter by plan" className={`${field} w-40`}>
              {planFilters.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        }
      >
        <div className="mb-5 flex flex-wrap gap-x-9 border-b border-line" role="tablist">
          {tabs.map((t) => (
            <button
              key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                tab === t ? 'border-brand text-brand' : 'border-transparent text-slate-500 hover:text-navy'
              }`}
            >
              {t === 'All' ? 'All' : `${t} (${count(t)})`}
            </button>
          ))}
        </div>
        <Table head={['Feature', 'What it does', 'Area', 'Plan', '']}>
          {rows.length === 0 && (
            <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">No features match your search.</td></tr>
          )}
          {rows.map((f) => (
            <tr key={f.name}>
              <td className="px-5 py-5 font-semibold text-navy">{f.name}</td>
              <td className="px-5 py-5 text-slate-700">{f.text}</td>
              <td className="px-5 py-5"><Badge>{f.cat}</Badge></td>
              <td className="px-5 py-5 text-slate-600">{f.plan}</td>
              <td className="px-5 py-5">
                <button onClick={() => openTrial(f.plan === 'Pro' ? 'pro' : 'starter')} className="font-semibold text-brand hover:text-brand-dark">Try it</button>
              </td>
            </tr>
          ))}
        </Table>
      </Panel>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Panel title="How it works">
          <ol className="space-y-5">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-4">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand text-lg font-bold text-white">{s.n}</span>
                <div>
                  <p className="font-semibold text-navy">{s.title}</p>
                  <p className="text-slate-600">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="What tradespeople say">
          <div className="space-y-5">
            {quotes.map((q) => (
              <figure key={q.name} className="border-l-4 border-brand pl-4">
                <blockquote className="text-slate-700">“{q.text}”</blockquote>
                <figcaption className="mt-1 text-sm"><b className="text-navy">{q.name}</b>, {q.trade}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">Sample testimonials for the student project.</p>
        </Panel>
      </div>

      <Panel className="mt-8 text-center">
        <h2 className="text-2xl font-normal text-navy">Ready to win back your evenings?</h2>
        <p className="mt-2 text-slate-500">Try TradesDash free for 14 days.</p>
        <Button onClick={() => openTrial()} className="mt-5 !px-7 !py-3">Start Free Trial</Button>
      </Panel>
    </>
  )
}
