import 'dotenv/config'
import createApp from './app.js'
import { connectDB } from './db.js'

const PORT = process.env.PORT || 5000

try {
  await connectDB()
} catch (err) {
  console.error('\nCould not connect to MongoDB:', err.message)
  console.error('Check MONGODB_URI in server/.env, your internet, and that your IP address is allowed in Atlas (Network Access).')
  process.exit(1)
}

createApp().listen(PORT, () => console.log(`TradesDash API running on http://localhost:${PORT}`))
