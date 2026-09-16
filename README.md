# Verity Health — QA Playground 🏥

A Clinical Healthcare Management & QA Automation Playground built for practicing Web UI automation, REST API testing, and security validation.

> 🚧 **Work in Progress**: This project is currently under active development. New features, UI workflows, and automated tests are being developed and tested side-by-side.

---

## ⚡ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Nginx
- **Backend**: Node.js, Express, TypeScript, PostgreSQL (pg, bcryptjs, JWT)
- **Database**: PostgreSQL 16 (Auto-initializing schema, pgcrypto)
- **Deployment**: Docker & Docker Compose
- **API Specs**: OpenAPI 3.0 (Swagger UI)
- **Testing**: Complete `data-testid` coverage for Cypress, Playwright, and Selenium

---

## 🐳 Run with Docker (1 Command — Recommended)

Run the entire full-stack app (PostgreSQL, Backend API, and Frontend SPA):

```bash
docker compose up --build -d
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Swagger Docs**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
- **PostgreSQL**: `localhost:5432` (`db: verity_health`, `user: postgres`, `pass: postgrespassword`)

To stop:
```bash
docker compose down
```

---

## 💻 Local Development (Without Docker)

### 1. Backend Setup

```bash
cd backend
npm install
# Ensure DATABASE_URL in backend/.env is set to your local PostgreSQL instance
npm run dev              # Runs on http://localhost:3001
```

> **Database**: Tables and indexes are initialized automatically on server startup. Schema reference: [`backend/src/db/schema.sql`](backend/src/db/schema.sql).

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev              # Runs on http://localhost:5173
```

---

## 📖 API Documentation & Postman

- **Swagger UI**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
- **OpenAPI 3.0 JSON**: [http://localhost:3001/api-docs.json](http://localhost:3001/api-docs.json)

**Postman Import**: Open Postman → **Import** → **Link** → paste `http://localhost:3001/api-docs.json`.

### Endpoints

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register Patient or Doctor | Public |
| `POST` | `/api/auth/login` | Login & receive Bearer JWT | Public |
| `GET` | `/api/auth/register-status` | Registration system status | Public |
| `GET` | `/api/auth/home` | Public clinical portal summary | Optional JWT |
| `GET` | `/api/auth/me` | Authenticated user profile | Required JWT |

---

## 🧪 QA Automation Highlights

- **Role-based Flows**: Patient & Doctor multi-step registration forms
- **Nepal Phone Validation**: `NP +977` prefix with 10-digit number validation (`97|98`)
- **Locators**: Every input, button, tab, dropdown, error banner, and toast includes standard `data-testid` attributes.
