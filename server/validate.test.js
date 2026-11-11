import test from 'node:test'
import assert from 'node:assert/strict'
import { validateTrialSignup } from './lib/validate.js'
import { plans } from './data/plans.js'

const ctx = { plans, emailTaken: (e) => e === 'taken@x.com' }
const good = { businessName: 'QuickFix Ltd', ownerName: 'Sam', email: 'Sam@Example.com', trade: 'Plumber', planId: 'pro' }

test('accepts a good form and cleans it', () => {
  const { errors, value } = validateTrialSignup(good, ctx)
  assert.deepEqual(errors, {})
  assert.equal(value.email, 'sam@example.com')
})

test('rejects empty body', () => {
  const { errors } = validateTrialSignup(undefined, ctx)
  assert.ok(errors.businessName && errors.ownerName && errors.email)
})

test('rejects bad email, taken email, unknown plan, unknown trade', () => {
  assert.ok(validateTrialSignup({ ...good, email: 'nope' }, ctx).errors.email)
  assert.match(validateTrialSignup({ ...good, email: 'taken@x.com' }, ctx).errors.email, /already/)
  assert.ok(validateTrialSignup({ ...good, planId: 'gold' }, ctx).errors.planId)
  assert.ok(validateTrialSignup({ ...good, trade: 'Wizard' }, ctx).errors.trade)
})

test('defaults plan to starter and trade to Other', () => {
  const { errors, value } = validateTrialSignup({ ...good, planId: '', trade: '' }, ctx)
  assert.deepEqual(errors, {})
  assert.equal(value.planId, 'starter')
  assert.equal(value.trade, 'Other')
})

test('ignores non-string values', () => {
  const { errors } = validateTrialSignup({ businessName: 123, ownerName: {}, email: [] }, ctx)
  assert.ok(errors.businessName && errors.ownerName && errors.email)
})

test('owner name must be letters only', () => {
  assert.ok(validateTrialSignup({ ...good, ownerName: 'Sam123' }, ctx).errors.ownerName)
  assert.ok(validateTrialSignup({ ...good, ownerName: '123' }, ctx).errors.ownerName)
  assert.deepEqual(validateTrialSignup({ ...good, ownerName: "Mary-Anne O'Neil" }, ctx).errors, {})
  assert.deepEqual(validateTrialSignup({ ...good, ownerName: 'نداء' }, ctx).errors, {})
})

test('business name may contain numbers', () => {
  assert.deepEqual(validateTrialSignup({ ...good, businessName: 'A1 Plumbing 24/7' }, ctx).errors, {})
})
