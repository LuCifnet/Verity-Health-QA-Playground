import cors from 'cors'
import express, { type Express } from 'express'
import helmet from 'helmet'

export function applySecurityMiddleware(app: Express): void {
  // Sets HTTP response security headers with CSP disabled for Swagger UI
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  )

  // Configures CORS for frontend origin
  const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'
  app.use(
    cors({
      origin: clientOrigin,
      methods: ['POST', 'GET', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )

  // Body parser limit against large payload denial-of-service
  app.use(express.json({ limit: '10kb' }))

  // Prevent browser caching of API responses so Network tab always shows fresh requests
  app.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    next()
  })
}
