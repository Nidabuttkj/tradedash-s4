import { db } from './db.js'
import { plans as defaultPlans } from './data/plans.js'

// One place that talks to the data. Uses MongoDB when connected, otherwise memory.
const memTenants = []
let nextId = 1

const toPublic = (t) => ({
  id: String(t._id ?? t.id),
  businessName: t.businessName,
  ownerName: t.ownerName,
  email: t.email,
  trade: t.trade,
  plan: t.plan,
  status: t.status,
  createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
})

export async function listPlans() {
  if (db.connected) return db.Plan.find().select('-_id -__v').sort({ monthly: 1 }).lean()
  return defaultPlans
}

export async function findTenantByEmail(email) {
  if (db.connected) return db.Tenant.exists({ email })
  return memTenants.find((t) => t.email === email) || null
}

export async function createTenant({ businessName, ownerName, email, trade, planId }) {
  if (db.connected) {
    const doc = await db.Tenant.create({ businessName, ownerName, email, trade, plan: planId })
    return toPublic(doc.toObject())
  }
  const tenant = {
    id: nextId++, businessName, ownerName, email, trade, plan: planId,
    status: 'trial', createdAt: new Date().toISOString(),
  }
  memTenants.push(tenant)
  return toPublic(tenant)
}
