import test from 'node:test'
import assert from 'node:assert/strict'
import { listPlans, createTenant, findTenantByEmail } from './store.js'

// These tests run without MongoDB (in-memory mode).
test('lists Starter and Pro plans', async () => {
  const plans = await listPlans()
  assert.deepEqual(plans.map((p) => p.id), ['starter', 'pro'])
  assert.equal(plans[0].monthly, 19)
  assert.equal(plans[1].monthly, 49)
})

test('creates a tenant and finds it by email', async () => {
  assert.equal(await findTenantByEmail('a@b.com'), null)
  const t = await createTenant({ businessName: 'QuickFix', ownerName: 'Sam', email: 'a@b.com', trade: 'Plumber', planId: 'pro' })
  assert.equal(t.status, 'trial')
  assert.equal(t.plan, 'pro')
  assert.ok(t.id && t.createdAt)
  assert.ok(await findTenantByEmail('a@b.com'))
})
