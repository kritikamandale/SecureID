# SECUREID — AI-Powered Student Identity Verification Platform

SECUREID is a full-stack platform for **secure university student identity verification** combining AI facial recognition, KYC document checks, JWT authentication, blockchain audit trail, and a real-time admin dashboard.

**Demo flow:** Register → KYC → Face Enroll → Face Authenticate → Dashboard

---

## Project Structure

```
SecureID/
├── backend/          # FastAPI REST API (Python)
├── face-service/     # DeepFace microservice (Python)
├── frontend/         # React 18 + MUI SPA
├── blockchain/       # Hardhat + Solidity smart contract
└── devops/           # Docker Compose for local orchestration
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Material UI v7, React Router v6 |
| Backend | FastAPI, SQLAlchemy, Pydantic v2, python-jose, passlib/bcrypt |
| Face AI | DeepFace microservice (cosine similarity, graceful fallback) |
| Database | SQLite (local dev) / PostgreSQL (Docker / production) |
| Auth | JWT Bearer tokens |
| Blockchain | Hardhat + Solidity (local node), Web3.py |
| QR Code | qrcode.react |
| Container | Docker Compose |

---

## Backend (`backend/app`)

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
- `config.py` — All settings via env vars with defaults; warns on weak JWT secret at startup
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

## AI Face Microservice (`face-service/`)

- `POST /generate-embedding` — Returns face embedding vector for a base64 image
- `POST /compare-face` — Cosine similarity vs stored embedding → `verified` + confidence score
- `GET /health` — Health check

Uses DeepFace when available; falls back to a deterministic embedding for environments without GPU/model files.

---

## Frontend (`frontend/`)

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

### Environment Variables (copy `frontend/.env.example` → `.env.local`)

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_FACE_SERVICE_URL=http://localhost:8001
```

---

## Blockchain (`blockchain/`)

Hardhat project with `StudentVerificationLedger.sol` — a Solidity contract that records a SHA-256 hash of each verification event (student ID + document hash + face score) on a local chain.

The backend calls the contract after each successful `POST /face/authenticate`.

```bash
cd blockchain
npm install
npx hardhat node          # start local chain on :8545
npx hardhat run scripts/deploy.js --network localhost
```

The deployed contract address and ABI are saved to `backend/app/blockchain_data/contract_info.json`.

---

## Running Locally (without Docker)

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate  |  macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt

# Copy and edit environment variables
copy .env.example .env

# Start (SQLite used by default in .env.example)
uvicorn app.main:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`

### 2. Face Microservice

```bash
cd face-service
python -m venv .venv
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # edit if ports differ
npm run dev
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
| Backend API | http://localhost:8000/docs |
| Face Service | http://localhost:8001/docs |

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `ENV` | `development` | Set to `production` to enforce strong JWT secret |
| `DATABASE_URL` | SQLite | PostgreSQL or SQLite connection string |
| `JWT_SECRET_KEY` | `CHANGE_ME_SUPER_SECRET` | **Must be changed in production** |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `FACE_SERVICE_URL` | `http://localhost:8001` | Face microservice URL |
| `BLOCKCHAIN_RPC_URL` | `http://127.0.0.1:8545` | Hardhat / EVM-compatible node |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend API base URL |
| `VITE_FACE_SERVICE_URL` | `http://localhost:8001` | Face service URL (health check) |

---

## Demo Flow

1. **Register** — Go to `/register`, create a student account (30 seconds)
2. **Login** — Sign in at `/login`; redirected to `/verify` if KYC/face are incomplete
3. **KYC** — Enter a 12-digit Aadhaar (e.g. `123456789012`) and upload any image as ID card → status becomes `verified`
4. **Face Enroll** — Allow webcam, centre your face, click **Capture & Enroll**
5. **Face Authenticate** — Capture a fresh frame → see `verified: true` with confidence score; a blockchain record is created
6. **Dashboard** — View identity card, blockchain history, and authentication log at `/dashboard`
7. **Admin** — Log in with an admin account and visit `/admin` for stats, student management, and auth logs

---

## Tests

```bash
# Backend
cd backend
pytest tests/

# Face service
cd face-service
pytest tests/
```
