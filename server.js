import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import cookieParser from "cookie-parser"
import { userData } from './routes/user.routes.js'
import { isloggin } from './routes/auth.routes.js'
import { adminRoute } from './routes/admin.routes.js'
import { information } from './routes/data.routes.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 7000

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "*", credentials: true }))
app.use(express.urlencoded({ extended: true }))

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')))

// API routes
app.use('/user', userData)
app.use('/auth', (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
}, isloggin)
app.use('/admin', adminRoute)
app.use('/information', information)

// Fallback for React (Express 5)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
    console.log("cloudflared tunnel run my-tunnel")
})
