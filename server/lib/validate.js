const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Letters (any language), spaces, apostrophe, dot, hyphen. No digits.
const NAME = /^\p{L}[\p{L}\s'.-]*$/u
export const TRADES = ['Plumber', 'Electrician', 'Gas engineer', 'Roofer', 'Other']

// Checks the trial-signup form. Returns { errors, value }.
// `errors` is empty when the form is fine, and `value` holds the cleaned data.
export function validateTrialSignup(body, { plans, emailTaken }) {
  const b = body && typeof body === 'object' ? body : {}
  const str = (v) => (typeof v === 'string' ? v.trim() : '')
  const errors = {}

  const businessName = str(b.businessName)
  const ownerName = str(b.ownerName)
  const email = str(b.email).toLowerCase()
  const trade = str(b.trade) || 'Other'
  const planId = str(b.planId) || 'starter'

  if (!businessName) errors.businessName = 'Business name is required'
  else if (businessName.length > 100) errors.businessName = 'Business name is too long'

  if (!ownerName) errors.ownerName = 'Your name is required'
  else if (ownerName.length > 100) errors.ownerName = 'Name is too long'
  else if (!NAME.test(ownerName)) errors.ownerName = 'Name can only contain letters'

  if (!EMAIL.test(email)) errors.email = 'Enter a valid email'
  else if (emailTaken(email)) errors.email = 'This email already has a trial'

  if (!TRADES.includes(trade)) errors.trade = 'Choose a trade from the list'
  if (!plans.some((p) => p.id === planId)) errors.planId = 'Unknown plan'

  return { errors, value: { businessName, ownerName, email, trade, planId } }
}
