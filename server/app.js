import express from 'express'
import cors from 'cors'
import publicRoutes from './routes/public.js'
import { rateLimit } from './lib/rateLimit.js'

export default function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', 1) // Render sits behind a proxy: needed to see the visitor's real IP

  // CLIENT_ORIGIN = the website address allowed to call this API (comma-separated for several).
  // Not set (local development) -> any origin is allowed.
  const origins = (process.env.CLIENT_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean)
  app.use(cors(origins.length ? { origin: origins } : undefined))

  app.use((req, res, next) => {
    res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer' })
    next()
  })
  app.use(express.json({ limit: '10kb' }))

  app.get('/', (req, res) => res.json({ name: 'TradesDash API', status: 'running' }))
  app.get('/api/health', (req, res) => res.json({ ok: true }))

  // Stop signup spam when live (off while developing so you can test freely)
  if (process.env.NODE_ENV === 'production') {
    app.use('/api/public/trial-signup', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }))
  }
  app.use('/api/public', publicRoutes)

  // Unknown /api route
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }))

  // Bad JSON and any other error -> JSON answer instead of an HTML error page
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' })
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large' })
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  })

  return app
}
