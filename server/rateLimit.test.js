import test from 'node:test'
import assert from 'node:assert/strict'
import { rateLimit } from './lib/rateLimit.js'

function run(mw, ip) {
  let status = 200, passed = false
  const res = { set() {}, status(s) { status = s; return this }, json() { return this } }
  mw({ ip }, res, () => { passed = true })
  return { passed, status }
}

test('allows up to max requests, then blocks with 429', () => {
  const mw = rateLimit({ windowMs: 60000, max: 3 })
  for (let i = 0; i < 3; i++) assert.ok(run(mw, '1.1.1.1').passed)
  const blocked = run(mw, '1.1.1.1')
  assert.equal(blocked.passed, false)
  assert.equal(blocked.status, 429)
})

test('limits each IP separately', () => {
  const mw = rateLimit({ windowMs: 60000, max: 1 })
  assert.ok(run(mw, '1.1.1.1').passed)
  assert.ok(run(mw, '2.2.2.2').passed)
})
