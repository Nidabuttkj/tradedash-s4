// Fallback plans, used when the backend is not running.
// Same as S2's Subscription & Billing screen: Starter £19, Pro £49.
export const plans = [
  {
    id: 'starter', name: 'Starter', monthly: 19, yearly: 15,
    features: ['Up to 3 users', 'Voice quotes', 'Invoicing'], highlighted: false,
  },
  {
    id: 'pro', name: 'Pro', monthly: 49, yearly: 39,
    features: ['Up to 10 users', 'Everything in Starter', 'WhatsApp sending', 'Certificates'], highlighted: true,
  },
]
