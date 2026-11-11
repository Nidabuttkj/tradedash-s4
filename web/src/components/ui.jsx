// Small building blocks that copy the Super Admin look.

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[2rem] font-normal leading-tight text-navy">{title}</h1>
        <p className="mt-1 text-lg text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

const tops = { navy: 'border-t-navy', brand: 'border-t-brand', red: 'border-t-red-700' }

// The three cards at the top of each admin page (coloured top border)
export function StatCard({ label, value, note, tone = 'navy', children }) {
  return (
    <div className={`rounded-2xl border border-line border-t-[3px] bg-white p-6 shadow-card ${tops[tone]}`}>
      <p className="text-slate-600">{label}</p>
      <p className={`mt-3 text-4xl font-bold ${tone === 'red' ? 'text-red-700' : 'text-navy'}`}>{value}</p>
      {note && <p className="mt-3 text-slate-500">{note}</p>}
      {children}
    </div>
  )
}

export function Panel({ title, right, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-6 shadow-card sm:p-7 ${className}`}>
      {(title || right) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          {title && <h2 className="text-2xl font-normal text-navy">{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </section>
  )
}

export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/50 disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const badgeTones = {
  brand: 'bg-brand-soft text-brand-dark',
  navy: 'bg-head text-navy',
  green: 'bg-emerald-50 text-tick',
}
export function Badge({ children, tone = 'brand' }) {
  return <span className={`inline-block rounded-md px-3 py-1 text-sm font-semibold ${badgeTones[tone]}`}>{children}</span>
}

// Table with the light-blue header row
export function Table({ head, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] text-left">
        <thead>
          <tr className="bg-head text-sm font-semibold text-navy">
            {head.map((h, i) => (
              <th key={h} className={`px-5 py-4 ${i === 0 ? 'rounded-l-lg' : ''} ${i === head.length - 1 ? 'rounded-r-lg' : ''}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  )
}

export function Tick({ yes }) {
  return yes ? (
    <svg className="h-5 w-5 text-tick" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-label="Included">
      <path d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <span className="text-slate-300" aria-label="Not included">—</span>
  )
}
