## SECUREID – AI Powered Student Identity Verification Platform

SECUREID is a full-stack, production-style platform for **secure university student verification** using:

- **KYC verification (mocked Aadhaar + ID card upload)**
- **AI facial authentication (DeepFace microservice)**
- **JWT-based authentication**
- **Admin analytics dashboard**
- **Microservices + Docker + Terraform + GitHub Actions**

This project is structured for hackathon demos where judges can run the full flow:

Register → KYC → Face Enroll → Face Authenticate → Admin Dashboard.

---

### Monorepo structure

- `backend/` – FastAPI API, PostgreSQL (SQLAlchemy), JWT auth, KYC, face, admin APIs
- `face-service/` – FastAPI microservice using DeepFace for embeddings and cosine similarity
- `frontend/` – React + Vite + Tailwind student portal and admin dashboard
- `devops/docker-compose.yml` – Local orchestration for backend, face-service, frontend, Postgres
- `devops/terraform/` – Basic AWS EC2 + RDS + security group infrastructure as code
- `.github/workflows/ci-cd.yml` – GitHub Actions CI (tests + Docker image builds)

---

### Backend overview (`backend/app`)

- `main.py` – FastAPI app, CORS, router registration, DB schema creation
- `config.py` – Settings (DB URL, JWT secret, CORS, face-service URL) via Pydantic
- `database.py` – SQLAlchemy engine, `SessionLocal`, `Base`, dependency `get_db`
- `models.py` – `Student`, `FaceEmbedding`, `AuthenticationLog`
- `schemas.py` – Pydantic models (auth, KYC, face, admin stats)
- `utils.py` – bcrypt hashing + JWT access token generation
- `auth.py` – registration helper, `authenticate_student`, `get_current_student` (JWT guard)
- `routes/auth_routes.py`
  - `POST /auth/register` – create student, hash password
  - `POST /auth/login` – return JWT bearer token
- `routes/kyc_routes.py`
  - `POST /kyc/verify` – mock Aadhaar validation (length == 12 ⇒ `"verified"`, else `"rejected"`)
- `routes/face_routes.py`
  - `POST /face/enroll` – send selfie to AI microservice, store embedding + mark `face_registered`
  - `POST /face/authenticate` – compare live image vs stored embedding, log result
- `routes/admin_routes.py`
  - `GET /admin/students` – list all students with statuses
  - `GET /admin/auth-logs` – authentication logs
  - `GET /admin/stats` – aggregate counts for dashboard
- `tests/test_auth_and_kyc.py` – pytest integration tests (JWT + KYC) using SQLite

Security:

- JWT bearer tokens (`Authorization: Bearer <token>`)
- Passwords hashed via `passlib[bcrypt]`
- Input validation via Pydantic schemas
- CORS configured to allow the frontend origin

---

### AI face microservice (`face-service/`)

- `app.py` – FastAPI service:
  - `POST /generate-embedding` – returns embedding vector for base64 image
  - `POST /compare-face` – cosine similarity against stored embedding
  - `GET /health` – health check
- `face_utils.py`
  - `load_image_from_base64` – decode base64 to `PIL.Image`
  - `generate_embedding` – DeepFace embedding (with graceful fallback if DeepFace unavailable)
  - `cosine_similarity` – vector similarity
  - `compare_face` – similarity → `verified` + confidence %
- `tests/test_face_utils.py` – unit test for cosine similarity

DeepFace is used when available; otherwise a deterministic fallback embedding keeps the service usable in constrained environments.

---

### Frontend (`frontend/`)

Tech stack:

- React 18, Vite, React Router
- TailwindCSS
- Axios (with JWT bearer injection)

Key files:

- `src/services/api.js`
  - Axios instance with `VITE_API_BASE_URL` (defaults to `http://localhost:8000`)
  - `authApi`, `kycApi`, `faceApi`, `adminApi` helpers
- `src/components/Navbar.jsx` – top navigation (student + admin + auth links)
- `src/components/StudentCard.jsx`, `StatusBadge.jsx` – admin UI components
- `src/pages/Login.jsx` – email/password login, saves JWT to `localStorage`
- `src/pages/Register.jsx` – student registration, stores `student_id` in `localStorage`
- `src/pages/KYCUpload.jsx`
  - Aadhaar input + ID card upload → base64 → `POST /kyc/verify`
- `src/pages/FaceEnroll.jsx`
  - Uses `navigator.mediaDevices.getUserMedia` to access webcam
  - Captures frame to canvas, converts to base64 → `POST /face/enroll`
- `src/pages/FaceAuth.jsx`
  - Same webcam capture flow → `POST /face/authenticate`, displays result + confidence
- `src/pages/admin/Dashboard.jsx` – stats from `GET /admin/stats`
- `src/pages/admin/StudentList.jsx` – uses `StudentCard` + `GET /admin/students`
- `src/pages/admin/AuthLogs.jsx` – table from `GET /admin/auth-logs`
- `src/App.jsx` – router wiring:
  - `/register`, `/login`, `/dashboard` (student journey)
  - `/admin` (dashboard + student list + logs)

Tailwind is configured in `tailwind.config.js` and `src/index.css`.

---

### Docker & docker-compose (`devops/docker-compose.yml`)

Services:

- `db` – PostgreSQL 15
  - DB: `secureid`, user: `secureid` / password: `secureid`
- `face-service` – DeepFace microservice on `:8001`
- `backend` – FastAPI backend on `:8000`
  - `DATABASE_URL=postgresql+psycopg2://secureid:secureid@db:5432/secureid`
  - `FACE_SERVICE_URL=http://face-service:8001`
  - `JWT_SECRET_KEY` set for container
- `frontend` – built React app served via `serve` on `:5173`

All services are connected on the `secureid-net` bridge network.

Run everything locally:

```bash
cd devops
docker compose up --build
```

Then:

- Backend API: `http://localhost:8000/docs`
- Face service: `http://localhost:8001/docs`
- Frontend UI: `http://localhost:5173`

---

### GitHub Actions CI/CD (`.github/workflows/ci-cd.yml`)

Pipeline stages:

- **backend-and-face-tests**
  - Sets `DATABASE_URL=sqlite:///./test.db` and `JWT_SECRET_KEY`
  - Installs backend deps and runs `pytest` in `backend/`
  - Installs face-service deps and runs `pytest` in `face-service/`
- **build-docker-images**
  - Builds Docker images:
    - `secureid-backend`
    - `secureid-face-service`
    - `secureid-frontend`
- **deploy**
  - Placeholder step ready to integrate with AWS ECS/EC2 or another platform

---

### Terraform IaC (`devops/terraform/`)

This directory contains a minimal AWS infrastructure definition:

- `variables.tf`
  - Region, project name, DB credentials, EC2 instance type, SSH key name
- `main.tf`
  - AWS provider + default VPC data source
  - Security group (`aws_security_group.secureid_sg`) for HTTP/HTTPS/SSH
  - `aws_db_instance.secureid_db` – PostgreSQL RDS instance
  - `aws_instance.secureid_app` – EC2 instance (user data installs Docker)
  - Outputs: app instance public IP and DB endpoint

Usage:

```bash
cd devops/terraform
terraform init
terraform plan -var="db_password=YOUR_DB_PASSWORD" -var="ssh_key_name=YOUR_KEY_NAME"
terraform apply -var="db_password=YOUR_DB_PASSWORD" -var="ssh_key_name=YOUR_KEY_NAME"
```

You would then point the backend `DATABASE_URL` at the RDS endpoint and deploy your Dockerized services onto the EC2 instance.

---

### Running the system locally (non-Docker)

1. **Backend**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# For quick local dev you can use SQLite:
export DATABASE_URL="sqlite:///./secureid.db"
export JWT_SECRET_KEY="dev-secret-key"
uvicorn app.main:app --reload --port 8000
```

2. **Face microservice**

```bash
cd face-service
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

3. **Frontend**

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Ensure `VITE_API_BASE_URL` (or the default `http://localhost:8000`) points to your backend.

---

### Demo flow for judges

1. **Register**
   - Open `http://localhost:5173`
   - Go to **Register** and create a student
2. **Login**
   - Login with the same email/password
3. **KYC Verification**
   - On **Student Dashboard**, go to the KYC section
   - Enter a 12-digit Aadhaar (e.g. `123456789012`) and upload any image as the ID card
   - Status should return `"verified"`
4. **Face Enrollment**
   - Use the **Face Enrollment** card
   - Allow webcam access, center your face, and click **Capture & Enroll**
5. **Face Authentication**
   - Move to **Face Authentication**
   - Capture a fresh frame and verify
   - You should see `verified: true` with a confidence score
6. **Admin Dashboard**
   - Navigate to `/admin`
   - See stats, student list (with KYC + face status), and authentication logs (including confidence scores and timestamps)

This completes the end-to-end **SECUREID – AI Powered Student Identity Verification Platform** demo.
