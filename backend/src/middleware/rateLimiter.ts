import rateLimit from 'express-rate-limit'

// Strict limiter: for POST /register and POST /login (brute-force protection)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // max 20 attempts per window per IP
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP. Please try again later.'
  }
})

// Relaxed limiter: for GET read-only endpoints (/me, /home, /register-status)
// These fire on every page mount so they need a generous limit for QA testing
export const readLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 120, // max 120 reads per minute per IP (generous for dev + StrictMode double calls)
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP. Please try again later.'
  }
})
