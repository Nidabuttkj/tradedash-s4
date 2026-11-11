// In-memory plans (Weeks 3-4). S2 owns the real `plans` table; in Weeks 5-6
// replace this file with a database read. Same data as S2's Billing screen.
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
