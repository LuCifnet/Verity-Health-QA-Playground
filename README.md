# Verity Health — QA Playground 🏥✨

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0%20Swagger-85EA2D?style=flat-square&logo=openapiinitiative&logoColor=black)](https://swagger.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

**Verity Health — QA Playground** is a full-stack, enterprise-grade Clinical & Patient Healthcare Portal built specifically for **QA Engineers, Automation Developers, and Manual Testers** to practice and develop test automation suites across Web UI, REST APIs, Security, Accessibility, and Database validation.

---

## 🌟 Key Highlights

- **Multi-Role Authentication**: Seamless role-based registration and authentication for both **Patients** and **Doctors**.
- **Multi-Step Doctor Registration**: 3-step credential verification wizard with document upload handling, specialization selection, and department assignment.
- **Nepal Number Validation**: Integrated `NP +977` phone input with custom validation rules (10 digits starting with `97` or `98`).
- **Custom Clinical UI Components**:
  - Theme-matching floating custom **Date Picker** with year/month fast switching.
  - Modern animated **Custom Select Dropdowns** with keyboard navigation and click-outside dismissal.
  - Real-time **Password Complexity Meter** with visual requirement checklists.
  - Responsive **Role-switching Auth Banners**.
- **QA-Ready Architecture**: Deterministic, unique `data-testid` locators on all interactive elements (inputs, buttons, tabs, alerts, validation messages).
- **Interactive OpenAPI 3.0 / Swagger**: Embedded interactive Swagger UI and downloadable JSON spec for 1-click Postman importing.
- **Robust Security**: Protected with HTTP security headers (Helmet), CORS, Rate Limiting, HTTP Parameter Pollution protection, and Supabase JWT verification.

---

## 🏗️ Architecture & Tech Stack

```
verity-health-qa-playground/
├── backend/                  # Node.js + Express REST API & Swagger docs
│   ├── src/
│   │   ├── config/           # Supabase client & Swagger configuration
│   │   ├── controllers/      # Auth & Profile controller logic
│   │   ├── middleware/       # Security, rate limiter, & JWT auth
│   │   ├── routes/           # Express route definitions
│   │   ├── schemas/          # Zod validation schemas
│   │   └── index.ts          # Server entry point
│   └── supabase/
│       └── schema.sql        # Database schema, triggers & RLS policies
│
└── frontend/                 # React 18 + TypeScript + Vite SPA
    ├── src/
    │   ├── api/              # Axios / Fetch client service methods
    │   ├── components/       # Custom DatePicker, Select, PhoneInput, Auth forms
    │   ├── context/          # React Auth Context & Session Management
    │   ├── pages/            # Home, Login, and Registration views
    │   └── types/            # TypeScript interfaces & types
    └── public/               # Banner assets & static media
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm** or **pnpm** / **yarn**
- **Supabase Account** (free tier PostgreSQL database)

---

### 1. Backend Setup

1. Open terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your Supabase credentials and JWT secret:
   ```env
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   SUPABASE_URL=https://your-supabase-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. Set up Database Schema:
   - Go to your **Supabase Dashboard** -> **SQL Editor**.
   - Copy and execute the contents of [`backend/supabase/schema.sql`](backend/supabase/schema.sql).

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3001`.

---

### 2. Frontend Setup

1. Open another terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Ensure the API URL points to the backend:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 📖 API Documentation & Postman Import

The backend provides an interactive Swagger UI:

- **Swagger UI**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
- **OpenAPI 3.0 JSON Spec**: [http://localhost:3001/api-docs.json](http://localhost:3001/api-docs.json)

### Importing into Postman
1. Open **Postman**.
2. Click **Import** -> **Link**.
3. Paste: `http://localhost:3001/api-docs.json`
4. Click **Import** to automatically generate all requests, role models, and examples.

### Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new Patient or Doctor account | ❌ Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT Bearer token | ❌ Public |
| `GET` | `/api/auth/register-status` | System health and live registration status | ❌ Public |
| `GET` | `/api/auth/home` | Public clinical portal summary & quick stats | 🟡 Optional Bearer JWT |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile & role data | ✅ Required Bearer JWT |

---

## 🧪 QA Automation Guide

Every interactive element across Verity Health includes standard, stable `data-testid` selectors.

### Key Locator IDs:

| Element | `data-testid` |
| :--- | :--- |
| Role Switcher Tabs | `patient-tab-button`, `doctor-tab-button` |
| First Name Input | `patient-first-name-input`, `doctor-first-name-input` |
| Last Name Input | `patient-last-name-input`, `doctor-last-name-input` |
| Date of Birth | `patient-dob-input`, `dateOfBirth-trigger` |
| Gender Dropdown | `patient-gender-select`, `gender-option-male`, `gender-option-female` |
| Phone Input | `patient-phone-input`, `doctor-phone-input` |
| Email Address | `patient-email-input`, `doctor-email-input` |
| Password / Toggle | `patient-password-input`, `password-toggle-password` |
| Confirm Password | `patient-confirm-password-input` |
| Terms Checkbox | `patient-terms-checkbox` |
| Submit Button | `patient-submit-button` |
| Doctor Wizard Next/Prev | `doctor-next-step-1`, `doctor-next-step-2`, `doctor-prev-step-2` |
| License Upload | `doctor-license-file-input` |

### Example Cypress Test Snippet:
```typescript
describe('Patient Registration Flow', () => {
  it('should successfully register a new patient', () => {
    cy.visit('http://localhost:5173/register')
    cy.get('[data-testid="patient-first-name-input"]').type('Aayush')
    cy.get('[data-testid="patient-last-name-input"]').type('Sharma')
    cy.get('[data-testid="patient-phone-input"]').type('9841234567')
    cy.get('[data-testid="patient-email-input"]').type('aayush.sharma@example.com')
    cy.get('[data-testid="patient-password-input"]').type('SecurePass123!#')
    cy.get('[data-testid="patient-confirm-password-input"]').type('SecurePass123!#')
    cy.get('[data-testid="patient-terms-checkbox"]').check()
    cy.get('[data-testid="patient-submit-button"]').click()

    cy.get('[data-testid="auth-alert"]').should('contain.text', 'Registration successful')
  })
})
```

---

## 🛡️ Security Features

- **Rate Limiting**: Configured `express-rate-limit` to prevent brute-force attacks.
- **Helmet**: Secures HTTP response headers.
- **Data Sanitization**: Prevents SQL injection & Cross-Site Scripting (XSS).
- **HPP Protection**: Prevents HTTP parameter pollution attacks.
- **JWT Authentication**: Industry-standard JSON Web Token claims with Supabase Auth integration.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for personal learning, portfolio projects, and QA automation practice.
