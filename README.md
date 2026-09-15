# Verity Health — QA Playground 🏥

A Clinical Healthcare Management & QA Automation Playground built for practicing Web UI automation, REST API testing, and security validation.

---

## ⚡ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Supabase (PostgreSQL)
- **API Specs**: OpenAPI 3.0 (Swagger UI)
- **Testing**: Complete `data-testid` coverage for Cypress, Playwright, and Selenium

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env     # Add your Supabase & JWT keys
npm run dev              # Runs on http://localhost:3001
```

> **Database**: Run [`backend/supabase/schema.sql`](backend/supabase/schema.sql) in your Supabase SQL Editor.

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:3001/api
npm run dev              # Runs on http://localhost:5173
```

---

## 📖 API Documentation & Postman

- **Swagger UI**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
- **OpenAPI 3.0 JSON**: [http://localhost:3001/api-docs.json](http://localhost:3001/api-docs.json)

**Postman Import**: Open Postman → **Import** → **Link** → paste `http://localhost:3001/api-docs.json`.

### Endpoints

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register Patient or Doctor | Public |
| `POST` | `/api/auth/login` | Login & receive Bearer JWT | Public |
| `GET` | `/api/auth/register-status` | Registration system status | Public |
| `GET` | `/api/auth/home` | Public clinical portal summary | Optional JWT |
| `GET` | `/api/auth/me` | Authenticated user profile | Required JWT |

---

## 🧪 QA Automation Highlights

- **Role-based Flows**: Patient & Doctor multi-step registration forms
- **Nepal Phone Validation**: `NP +977` prefix with 10-digit number validation (`97|98`)
- **Locators**: Every input, button, tab, dropdown, and error banner includes standard `data-testid` attributes.
