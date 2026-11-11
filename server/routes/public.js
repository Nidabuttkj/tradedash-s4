import { Router } from 'express'
import { listPlans, createTenant, findTenantByEmail } from '../store.js'
import { validateTrialSignup } from '../lib/validate.js'

const router = Router()
const DUPLICATE = { errors: { email: 'This email already has a trial' } }

// GET /api/public/plans  -> list of plans for the Pricing page
router.get('/plans', async (req, res, next) => {
  try {
    res.json(await listPlans())
  } catch (err) {
    next(err)
  }
})

// POST /api/public/trial-signup  -> creates a tenant, tells the frontend where to go next
router.post('/trial-signup', async (req, res, next) => {
  try {
    const plans = await listPlans()
    const { errors, value } = validateTrialSignup(req.body, { plans, emailTaken: () => false })

    if (!Object.keys(errors).length && (await findTenantByEmail(value.email))) {
      errors.email = DUPLICATE.errors.email
    }
    if (Object.keys(errors).length) return res.status(400).json({ errors })

    let tenant
    try {
      tenant = await createTenant(value)
    } catch (err) {
      if (err.code === 11000) return res.status(400).json(DUPLICATE) // two signups at the same moment
      throw err
    }
    // TODO: call S3's logAudit('trial_signup', tenant.id)
    res.status(201).json({ tenant, redirectTo: '/dashboard' })
  } catch (err) {
    next(err)
  }
})

export default router
