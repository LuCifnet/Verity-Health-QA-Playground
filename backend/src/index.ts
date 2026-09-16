import 'dotenv/config'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { initDb } from './config/db.js'
import { swaggerSpec } from './config/swagger.js'
import { applySecurityMiddleware } from './middleware/security.js'
import authRoutes from './routes/auth.routes.js'

const app = express()
const port = Number(process.env.PORT ?? 3001)

// Apply security & parsing middleware (Helmet, CORS, JSON limit)
applySecurityMiddleware(app)

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .servers { display: none }'
}))
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

// Register auth routes
app.use('/api/auth', authRoutes)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

app.listen(port, async () => {
  console.log(`[API Server] Running at http://localhost:${port}`)
  console.log(`[Swagger UI] Documentation available at http://localhost:${port}/api-docs`)
  // Auto-initialize PostgreSQL database schema
  await initDb()
})
