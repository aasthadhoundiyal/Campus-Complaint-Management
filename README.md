# 🎓 Campus Complaint Management System

A full-stack web application designed for campus communities (students, faculty, and administrative staff) to file, track, resolve, and audit campus complaints.

---

## 🏛️ Architecture Overview

The system consists of three containerized services managed via Docker Compose:

| Service | Technology | Port Mapping | Container Name | Description |
|---|---|---|---|---|
| **Frontend** | React, Vite, TailwindCSS, Nginx | `3000:3000` | `campus-complaint-frontend` | Responsive UI with real-time ticket tracking, filtering & analytics |
| **Backend** | Node.js, Express REST API | `5000:5000` | `campus-complaint-backend` | REST API handling auth, routing, audit logs & status transitions |
| **Database** | SQLite / LowDB & PostgreSQL 15 | `5432:5432` | `campus-complaint-db` | Persistent volume storage for ticket data and relational schema |

---

## 📋 Prerequisites

Before running the application, make sure you have installed:

- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Windows, macOS, or Linux) with Docker Compose enabled.
- *(Optional for non-containerized dev)*: **[Node.js](https://nodejs.org/)** (v18 or v20+) and **npm**.

> [!NOTE]
> On Windows, ensure **Docker Desktop** is open and running before executing Docker commands in PowerShell or CMD.

---

## 🚀 Quick Start with Docker (Single Command)

### Step 1: Open Terminal in Project Root
Navigate to the root directory where `docker-compose.yml` is located:
```bash
cd Complaint-management
```

### Step 2: Build and Run
Run the entire full-stack application using a single command:

```bash
docker-compose up --build
```

*(Optional: Run in background / detached mode)*:
```bash
docker-compose up -d --build
```

### Step 3: Access the Application
Once the containers start up, open your browser:

- 🌐 **Web Application (Frontend)**: [http://localhost:3000](http://localhost:3000)
- 🔌 **API Base**: [http://localhost:5000/api](http://localhost:5000/api)
- 🩺 **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- 🗄️ **PostgreSQL Connection**: `localhost:5432` (User: `postgres`, Pass: `postgres`, DB: `campus_complaints`)

---

## 👥 Demo User Accounts (Pre-Seeded)

The database automatically seeds on first launch with demo data across all three user roles:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Student** | `aastha.dhoundiyal@campus.edu` | `student123` | Can file complaints and view their own tickets |
| **Student** | `priya.sharma@campus.edu` | `student123` | Student view (Hostel Block B tickets) |
| **Student** | `david.kim@campus.edu` | `student123` | Student view (Cafeteria tickets) |
| **Faculty** | `m.vance@campus.edu` | `faculty123` | Faculty view (Lab maintenance tickets) |
| **Faculty** | `a.rao@campus.edu` | `faculty123` | Faculty view (Attendance & academic portal tickets) |
| **Admin** | `admin@campus.edu` | `admin123` | **Full access**: view all tickets, transition status, view analytics |
| **Admin** | `warden@campus.edu` | `admin123` | **Full access**: hostel administration & ticket routing |

---

## 🛠️ Common Docker Commands

### View Container Status
```bash
docker-compose ps
```

### View Live Container Logs
```bash
# All services
docker-compose logs -f

# Specific service (e.g., backend or frontend)
docker-compose logs -f backend
```

### Re-seed Initial Demo Data Inside Container
If you ever want to reset the database back to clean seed data:
```bash
docker-compose exec backend node seed.js
```

### Stop Containers
```bash
docker-compose down
```

### Stop Containers and Clear Volumes
To shut down and wipe persistent volumes (starts with a fresh database next time):
```bash
docker-compose down -v
```

---

## 💻 Alternative: Running Locally Without Docker

If you prefer to run the application directly on your machine without Docker containers:

### 1. Start the Backend API (Port 5000)
```bash
cd server
npm install
npm run seed     # Seeds campus.json with demo data
npm start        # Starts server on http://localhost:5000
```

### 2. Start the Frontend (Port 3000)
In a new terminal window:
```bash
# From project root
npm install
npm run dev      # Starts Vite dev server on http://localhost:3000
```

---

## 📡 Key API Endpoints

### Authentication
- `POST /api/auth/login` — Log in with email & password, receives JWT session token
- `POST /api/auth/logout` — Invalidate current session
- `GET /api/auth/me` — Inspect current authenticated session user

### Complaints Management
- `GET /api/complaints` — List complaints (filtered automatically by user role)
- `POST /api/complaints` — Create a new complaint (auto-assigned to department queue)
- `GET /api/complaints/:id` — Get single complaint details and timeline
- `PATCH /api/complaints/:id/status` — *(Admin)* Transition complaint status (`Pending` → `In Progress` → `Resolved`)
- `POST /api/complaints/:id/feedback` — *(Student)* Submit 1–5 star rating and review on resolved ticket

### Analytics & System
- `GET /api/analytics/summary` — *(Admin)* SLA compliance, department workloads, resolution rates
- `GET /api/health` — System status, uptime, and database records count

---

## 🔧 Troubleshooting

### 1. Port 5000 or 3000 Already in Use
If port 5000 is occupied by an existing local service:
- **Windows (PowerShell)**: Find the PID and stop it:
  ```powershell
  Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess
  Stop-Process -Id <PID> -Force
  ```
- Or modify the host port mapping in [docker-compose.yml](file:///c:/Users/HP/Desktop/Complaint-management/docker-compose.yml) (e.g. `"5001:5000"`).

### 2. Docker Daemon Not Running
Ensure Docker Desktop is launched and the whale icon is visible in the Windows taskbar tray.

### 3. Persisted Data Reset
If you want to clear stored complaints and start fresh:
```bash
docker-compose down -v
docker-compose up --build
```
