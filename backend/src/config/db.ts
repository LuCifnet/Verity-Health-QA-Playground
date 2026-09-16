import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'

const { Pool } = pg

// Ensure .env is loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

function getPoolConfig(): pg.PoolConfig {
  const dbUrl = process.env.DATABASE_URL?.trim()

  if (dbUrl) {
    try {
      const parsedUrl = new URL(dbUrl)
      return {
        host: parsedUrl.hostname || 'localhost',
        port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : 5432,
        user: decodeURIComponent(parsedUrl.username || 'postgres'),
        password: decodeURIComponent(parsedUrl.password || ''),
        database: decodeURIComponent(parsedUrl.pathname.replace(/^\//, '') || 'verity_health'),
        ssl:
          process.env.DATABASE_SSL === 'true' || dbUrl.includes('sslmode=require')
            ? { rejectUnauthorized: false }
            : false
      }
    } catch {
      return {
        connectionString: dbUrl,
        ssl:
          process.env.DATABASE_SSL === 'true' || dbUrl.includes('sslmode=require')
            ? { rejectUnauthorized: false }
            : false
      }
    }
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'verity_health',
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
  }
}

export const pool = new Pool(getPoolConfig())

pool.on('error', (err) => {
  console.error('[PostgreSQL] Unexpected idle client error:', err)
})

export function checkDbConfig() {
  const dbUrl = process.env.DATABASE_URL?.trim()
  return {
    isConfigured: true,
    databaseUrl: dbUrl ? dbUrl.replace(/:[^:@]+@/, ':****@') : 'localhost default'
  }
}

export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params)
}

/**
 * Automatically initializes the database schema if tables do not already exist.
 */
export async function initDb(): Promise<void> {
  const initSql = `
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone_number VARCHAR(50) NOT NULL,
      terms_accepted BOOLEAN DEFAULT true,

      -- Patient profile fields
      date_of_birth DATE,
      gender VARCHAR(50),

      -- Doctor profile fields
      medical_license_number VARCHAR(100),
      specialization VARCHAR(100),
      department VARCHAR(100),
      years_of_experience VARCHAR(50),
      qualification VARCHAR(255),
      license_document_url TEXT,

      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  `

  try {
    const client = await pool.connect()
    try {
      await client.query(initSql)
      console.log('[PostgreSQL] Database schema initialized and verified successfully.')
    } finally {
      client.release()
    }
  } catch (err: any) {
    console.error('[PostgreSQL] Database initialization warning / connection error:', err.message)
    console.error('Make sure PostgreSQL is running and DATABASE_URL in backend/.env is correct.')
  }
}
