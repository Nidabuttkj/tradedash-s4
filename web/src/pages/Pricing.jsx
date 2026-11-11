import { useState } from 'react'
import { PageHeader, StatCard, Panel, Button, Table, Tick } from '../components/ui.jsx'
import { useTrial } from '../context/TrialContext.jsx'
import usePlans from '../hooks/usePlans.js'
import { compare, faqs } from '../data/content.js'

function BillingToggle({ yearly, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-line bg-white p-1 text-sm font-medium">
      {[{ label: 'Monthly', value: false }, { label: 'Yearly (save 20%)', value: true }].map((o) => (
        <button
          key={o.label} onClick={() => onChange(o.value)} aria-pressed={yearly === o.value}
          className={`rounded-md px-4 py-2 transition ${yearly === o.value ? 'bg-brand text-white' : 'text-navy hover:bg-surface'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function PlanCard({ plan, yearly }) {
  const { openTrial } = useTrial()
  const price = yearly ? plan.yearly : plan.monthly
  return (
    <StatCard label={`${plan.name} plan`} tone={plan.highlighted ? 'brand' : 'navy'}
      value={<>£{price}<span className="text-base font-normal text-slate-500"> / month</span></>}>
      <p className="mt-1 h-5 text-xs text-slate-400">{yearly ? `Billed £${price * 12} yearly` : 'Billed monthly'}</p>
      <ul className="mt-4 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-3"><Tick yes />{f}</li>
        ))}
      </ul>
      <Button onClick={() => openTrial(plan.id)} className={`mt-6 w-full ${plan.highlighted ? '' : '!bg-navy hover:!bg-navy-700'}`}>
        Start Free Trial
      </Button>
    </StatCard>
  )
}

function Faq() {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <div className="divide-y divide-line">
      {faqs.map((item, i) => {
        const open = openIndex === i
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpenIndex(open ? -1 : i)} aria-expanded={open}
              className="flex w-full items-center justify-between py-4 text-left font-semibold text-navy"
            >
              {item.q}
              <span className={`ml-4 text-xl text-brand transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
            </button>
            {open && <p className="pb-5 text-slate-600">{item.a}</p>}
          </div>
        )
      })}
    </div>
  )
}

export default function Pricing() {
  const [yearly, setYearly] = useState(false)
  const plans = usePlans()

  return (
    <>
      <PageHeader title="Pricing" subtitle="Simple plans that pay for themselves. Try free for 14 days.">
        <BillingToggle yearly={yearly} onChange={setYearly} />
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-3">
        {plans.map((p) => <PlanCard key={p.id} plan={p} yearly={yearly} />)}
        <StatCard label="Free trial" value="14 days" tone="red"
          note="Every plan starts with a free trial. No card needed. Cancel any time." />
      </div>

      <Panel title="Compare plans" className="mt-8">
        <Table head={['Feature', 'Starter', 'Pro']}>
          {compare.map((r) => (
            <tr key={r.feature}>
              <td className="px-5 py-4 font-semibold text-navy">{r.feature}</td>
              {['starter', 'pro'].map((k) => (
                <td key={k} className="px-5 py-4 text-navy">
                  {typeof r[k] === 'string' ? r[k] : <Tick yes={r[k]} />}
                </td>
              ))}
            </tr>
          ))}
        </Table>
      </Panel>

      <Panel title="Questions, answered" className="mt-8"><Faq /></Panel>
    </>
  )
}
