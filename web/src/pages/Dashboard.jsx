import { useLocation, Link } from 'react-router-dom'
import { PageHeader, Panel } from '../components/ui.jsx'

// Temporary page. The real Dashboard is built by Group 1 (Voice Quote module).
export default function Dashboard() {
  const tenant = useLocation().state?.tenant
  return (
    <>
      <PageHeader title="Dashboard" subtitle="This screen is built by Group 1. It is a temporary page." />
      <Panel>
        {tenant ? (
          <>
            <p className="text-xl font-medium text-navy">Welcome, {tenant.ownerName}!</p>
            <p className="mt-2 text-slate-600">
              Your 14-day trial for <b>{tenant.businessName}</b> has started on the <b className="capitalize">{tenant.plan}</b> plan.
              A confirmation would be sent to {tenant.email}.
            </p>
          </>
        ) : (
          <p className="text-slate-600">Click "Start Free Trial" on the Home or Pricing page to see the signup working.</p>
        )}
        <Link to="/" className="mt-5 inline-block font-semibold text-brand hover:text-brand-dark">← Back to Home</Link>
      </Panel>
    </>
  )
}
