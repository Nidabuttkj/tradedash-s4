import { plans as defaultPlans } from './data/plans.js'

// Shared state: routes ask store.js, store.js looks here to see if MongoDB is connected.
export const db = { connected: false, Plan: null, Tenant: null }

// Connects to MongoDB when MONGODB_URI is set in server/.env.
// No URI -> returns false and the server uses in-memory data instead.
// URI set but connection fails -> throws, so the problem is visible (no silent fallback).
export async function connectDB() {
  const uri = process.env.MONGODB_URI?.trim()
  if (!uri) {
    console.log('MONGODB_URI is not set: using in-memory data (tenants are lost on restart).')
    return false
  }

  const { default: mongoose } = await import('mongoose')
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })

  // Collection: plans (S2 owns the final plans design; keep these field names in sync with S2)
  const planSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    monthly: { type: Number, required: true },
    yearly: { type: Number, required: true },
    features: [String],
    highlighted: { type: Boolean, default: false },
  })

  // Collection: tenants (S1 owns the final tenants schema; add S1's fields here when shared)
  const tenantSchema = new mongoose.Schema(
    {
      businessName: { type: String, required: true },
      ownerName: { type: String, required: true },
      email: { type: String, required: true, unique: true, lowercase: true },
      trade: { type: String, default: 'Other' },
      plan: { type: String, default: 'starter' },
      status: { type: String, default: 'trial' },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
  )

  db.Plan = mongoose.models.Plan || mongoose.model('Plan', planSchema)
  db.Tenant = mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema)
  await Promise.all([db.Plan.init(), db.Tenant.init()]) // make sure unique indexes exist

  if ((await db.Plan.countDocuments()) === 0) {
    await db.Plan.insertMany(defaultPlans)
    console.log('Added the starting plans (Starter, Pro) to MongoDB.')
  }

  db.connected = true
  console.log('MongoDB connected.')
  return true
}
