import { Router } from 'express'
import {
  homeHandler,
  loginHandler,
  meHandler,
  registerHandler,
  registerStatusHandler
} from '../controllers/auth.controller.js'
import { authLimiter, readLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// POST /api/auth/register       — strict rate limit (brute-force protection)
router.post('/register', authLimiter, registerHandler)

// POST /api/auth/login          — strict rate limit (brute-force protection)
router.post('/login', authLimiter, loginHandler)

// GET  /api/auth/register-status — relaxed rate limit (page-mount health check)
router.get('/register-status', readLimiter, registerStatusHandler)

// GET  /api/auth/home           — relaxed rate limit (page-mount status check)
router.get('/home', readLimiter, homeHandler)

// GET  /api/auth/me             — relaxed rate limit (session verification on mount)
router.get('/me', readLimiter, meHandler)

export default router
