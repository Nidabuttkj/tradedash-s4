// Tiny in-memory rate limiter (no extra package). Limits requests per IP address.
export function rateLimit({ windowMs, max }) {
  const hits = new Map()
  setInterval(() => {
    const now = Date.now()
    for (const [key, rec] of hits) if (now > rec.reset) hits.delete(key)
  }, windowMs).unref()

  return (req, res, next) => {
    const now = Date.now()
    const rec = hits.get(req.ip)
    if (!rec || now > rec.reset) {
      hits.set(req.ip, { count: 1, reset: now + windowMs })
      return next()
    }
    rec.count += 1
    if (rec.count > max) {
      res.set('Retry-After', String(Math.ceil((rec.reset - now) / 1000)))
      return res.status(429).json({ error: 'Too many attempts. Please wait a few minutes and try again.' })
    }
    next()
  }
}
