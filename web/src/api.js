// Small fetch helper.
// Development: VITE_API_URL is empty, so "/api/..." goes through the Vite proxy to localhost:5000.
// Deployed: VITE_API_URL is the live backend address (set in the Render dashboard).
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export async function api(path, options) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error('Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}
