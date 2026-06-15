# SECUREID — AI-Powered Student Identity Verification Platform

SECUREID is a full-stack platform for **secure university student identity verification** combining AI facial recognition, KYC document checks, JWT authentication, blockchain audit trail, and a real-time admin dashboard.

**Demo flow:** Register → KYC → Face Enroll → Face Authenticate → Dashboard

---

## Project Structure

This is a **Turborepo monorepo** managed with pnpm workspaces.

```
SecureID/
├── apps/
│   ├── frontend/         # React 18 + Vite + MUI SPA
│   ├── backend/          # FastAPI REST API (Python)
│   └── face-service/     # DeepFace microservice (Python)
├── packages/
│   ├── blockchain/       # Hardhat + Solidity smart contract
│   └── config/           # Shared configuration stubs
├── package.json          # Root workspace — pnpm + turbo scripts
├── pnpm-workspace.yaml   # pnpm workspace definition
└── turbo.json            # Turborepo task pipeline
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Material UI v7, React Router v6 |
| Backend | FastAPI, SQLAlchemy, Pydantic v2, python-jose, passlib/bcrypt |
| Face AI | DeepFace microservice (cosine similarity, graceful pixel fallback) |
| Database | SQLite (local dev) / PostgreSQL (Docker / production) |
| Auth | JWT Bearer tokens |
| Blockchain | Hardhat + Solidity (local node), Web3.py |
| QR Code | qrcode.react |
| Container | Docker Compose |

---

## Backend (`apps/backend/`)

### Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Register a student account |
| POST | `/auth/login` | — | Login, returns JWT |
| POST | `/kyc/verify` | JWT | Submit Aadhaar + ID card for KYC |
| POST | `/face/enroll` | JWT | Enroll face biometric |
| POST | `/face/authenticate` | JWT | Authenticate via live selfie |
| GET | `/student/timeline` | JWT | Fetch personal verification timeline |
| GET | `/verification/history/{id}` | JWT | Blockchain verification history |
| GET | `/admin/students` | JWT + Admin | List all students |
| GET | `/admin/stats` | JWT + Admin | Aggregate stats |
| GET | `/admin/auth-logs` | JWT + Admin | All authentication logs |
| POST | `/admin/students/{id}/revoke` | JWT + Admin | Revoke student verification |
| GET | `/admin/export/students` | JWT + Admin | Export CSV |
| GET | `/admin/export/auth-logs` | JWT + Admin | Export CSV |
| GET | `/health` | — | Health check |

### Key Files

- `main.py` — App setup, CORS (reads `settings.BACKEND_CORS_ORIGINS`), lifespan
- `config.py` — All settings via pydantic-settings, auto-loads `apps/backend/.env`; warns on weak JWT secret at startup
- `models.py` — `Student`, `FaceEmbedding`, `AuthenticationLog` (with event timestamps)
- `auth.py` — Registration (blocks admin role), login, JWT guard dependency
- `utils.py` — bcrypt hashing, JWT generation
- `routes/admin_routes.py` — All admin endpoints require valid JWT + `role == "admin"`
- `blockchain_service.py` — Connects to local Hardhat node (configurable via `BLOCKCHAIN_RPC_URL`)

### Security

- Passwords hashed with bcrypt via `passlib`
- JWT Bearer tokens (HS256), expiry configurable
- Admin routes protected by `require_admin` dependency (JWT + role check)
- Public registration blocks `role: admin` — admin accounts must be created directly in the DB
- CORS origins configurable via `FRONTEND_ORIGIN` / `FRONTEND_ORIGIN_DOCKER` env vars
- Startup warning if `JWT_SECRET_KEY` is the default value; raises error in production

---

## AI Face Microservice (`apps/face-service/`)

- `POST /generate-embedding` — Returns face embedding vector for a base64 image
- `POST /compare-face` — Cosine similarity vs stored embedding → `verified` + confidence score
- `GET /health` — Health check

Uses DeepFace when available. Falls back to a deterministic pixel-based descriptor (controlled by `FACE_FALLBACK=true`) for environments without GPU or model files — enrollment and re-authentication of the same person still work consistently under this mode.

---

## Frontend (`apps/frontend/`)

### Pages & Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | `HomePage` | Public |
| `/login` | `SignIn` | Public |
| `/register` | `SignUp` | Public |
| `/verify` | `VerificationFlow` | Authenticated students |
| `/dashboard` | `StudentDashboard` | Authenticated students |
| `/verification-history` | `StudentVerificationHistory` | Authenticated students |
| `/admin` | `AdminPortal` | Authenticated admins only |

### Key Components

- `Navbar` — Role-aware nav links (Admin link only for admin role); mobile slide-out drawer
- `ProtectedRoute` — Redirects unauthenticated users to `/login`
- `StudentIDCard` — Digital ID card with QR code
- `SystemStatus` — Live health check for backend and face service
- `Timeline` — Chronological verification event list

### Environment Variables (`apps/frontend/.env.local`)

```env
VITE_API_BASE_URL=http://localhost:8002
VITE_FACE_SERVICE_URL=http://localhost:8001
```

---

## Blockchain (`packages/blockchain/`)

Hardhat project with `StudentVerificationLedger.sol` — a Solidity contract that records a SHA-256 hash of each verification event (student ID + document hash + face score) on a local chain.

The backend calls the contract after each successful `POST /face/authenticate`.

```bash
# From repo root (recommended)
pnpm blockchain:node      # start local Hardhat chain on :8545
pnpm blockchain:deploy    # deploy contract; writes ABI to apps/backend/app/blockchain_data/

# Or manually
cd packages/blockchain
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

The deployed contract address and ABI are saved to `apps/backend/app/blockchain_data/contract_info.json`.

---

## Running Locally (without Docker)

### Install all dependencies

```bash
# From repo root — installs JS/TS deps for all workspaces
pnpm install
```

### Run all services in parallel (Turborepo)

```bash
pnpm dev           # starts frontend + backend + face-service concurrently
```

Or start individual services:

```bash
pnpm dev:frontend       # React + Vite on :5173
pnpm dev:backend        # FastAPI on :8002
pnpm dev:face-service   # Face microservice on :8001
```

### Manual (per-service)

**Backend**
```bash
cd apps/backend
python -m venv .venv
# Windows: .venv\Scripts\activate  |  macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
# A pre-configured .env is included (SQLite by default)
uvicorn app.main:app --reload --port 8002
```

API docs: `http://localhost:8002/docs`

**Face Microservice**
```bash
cd apps/face-service
python -m venv .venv
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

**Frontend**
```bash
cd apps/frontend
# .env.local already points to :8002 and :8001
pnpm dev
```

App: `http://localhost:5173`

---

## Running with Docker Compose

```bash
cd devops
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8002/docs |
| Face Service | http://localhost:8001/docs |

---

## Environment Variables Reference

### Backend (`apps/backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `ENV` | `development` | Set to `production` to enforce strong JWT secret |
| `DATABASE_URL` | `sqlite:///./secureid.db` | PostgreSQL or SQLite connection string |
| `JWT_SECRET_KEY` | `CHANGE_ME_SUPER_SECRET` | **Must be changed in production** |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `FACE_SERVICE_URL` | `http://localhost:8001` | Face microservice URL |
| `BLOCKCHAIN_RPC_URL` | `http://127.0.0.1:8545` | Hardhat / EVM-compatible node |

### Face Service

| Variable | Default | Description |
|----------|---------|-------------|
| `FACE_FALLBACK` | `true` | Use pixel-based fallback when DeepFace is unavailable |
| `FACE_MODEL` | `Facenet` | DeepFace model name (ignored when fallback is active) |
| `FACE_MATCH_THRESHOLD` | `0.60` | Cosine similarity threshold for a positive match |

### Frontend (`apps/frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8002` | Backend API base URL |
| `VITE_FACE_SERVICE_URL` | `http://localhost:8001` | Face service URL (health check) |

---

## Demo Flow

1. **Register** — Go to `/register`, create a student account
2. **Login** — Sign in at `/login`; redirected to `/verify` if KYC/face are incomplete
3. **KYC** — Enter a 12-digit Aadhaar (e.g. `123456789012`) and upload any image as ID card → status becomes `verified`
4. **Face Enroll** — Allow webcam, centre your face, click **Capture & Enroll**
5. **Face Authenticate** — Capture a fresh frame → see `verified: true` with confidence score; a blockchain record is created
6. **Dashboard** — View identity card, blockchain history, and authentication log at `/dashboard`
7. **Admin** — Log in with an admin account and visit `/admin` for stats, student management, and auth logs

---

## Build & Tests

```bash
# Run all builds via Turborepo (frontend only — Python services have no build step)
pnpm build

# Run all tests
pnpm test

# Per-package filter
pnpm turbo run test --filter=@secureid/face-service
pnpm turbo run test --filter=@secureid/backend

# Manual per-service
cd apps/backend && python -m pytest tests/ -v
cd apps/face-service && python -m pytest tests/ -v
```
