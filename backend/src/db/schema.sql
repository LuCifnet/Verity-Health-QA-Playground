-- PostgreSQL Database Schema for Healthcare QA Playground

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

-- Indices for rapid lookups and constraints
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
