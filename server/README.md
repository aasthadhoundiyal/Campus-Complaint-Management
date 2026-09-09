# Campus Complaint Management — Express REST API

## Overview

Node.js + Express backend with JSON file storage (`lowdb`) for the Campus Complaint Management System.

**Storage file:** `server/data/campus.json` (auto-created on first run)

---

## Setup & Running

```bash
# 1. Move into the server directory
cd server

# 2. Install dependencies (one-time)
npm install

# 3. Seed the database with demo users and complaints
node seed.js

# 4. Start the API server (port 4000)
npm start
```

The frontend Vite dev server runs separately on **port 3000**.
The API server runs on **port 4000**.

---

## Demo Accounts (seed data)

| Role    | Email                         | Password     | Sees                        |
|---------|-------------------------------|--------------|-----------------------------|
| Student | aastha.dhoundiyal@campus.edu  | `student123` | Only own 3 tickets          |
| Student | priya.sharma@campus.edu       | `student123` | Only own 1 ticket           |
| Student | david.kim@campus.edu          | `student123` | Only own 1 ticket           |
| Student | sarah.jenkins@campus.edu      | `student123` | Only own 1 ticket           |
| Faculty | m.vance@campus.edu            | `faculty123` | Only own 1 ticket           |
| Faculty | a.rao@campus.edu              | `faculty123` | Only own 1 ticket           |
| Admin   | admin@campus.edu              | `admin123`   | **All 8 tickets**           |
| Admin   | warden@campus.edu             | `admin123`   | **All 8 tickets**           |

---

## API Endpoints

### Auth
| Method | Endpoint            | Auth? | Description                 |
|--------|---------------------|-------|-----------------------------|
| POST   | `/api/auth/login`   | No    | Login → returns `{ token, user }` |
| POST   | `/api/auth/logout`  | Yes   | Destroy session             |
| GET    | `/api/auth/me`      | Yes   | Current session user        |

**Login request body:**
```json
{ "email": "aastha.dhoundiyal@campus.edu", "password": "student123" }
```

**Login response:**
```json
{
  "token": "abc123...",
  "user": { "id": 1, "name": "Aastha Dhoundiyal", "role": "student", "department": "..." }
}
```

Pass the token on subsequent requests via the `Authorization` header:
```
Authorization: Bearer <token>
```

---

### Complaints

| Method | Endpoint                          | Auth? | Description                                      |
|--------|-----------------------------------|-------|--------------------------------------------------|
| GET    | `/api/complaints`                 | Yes   | List tickets — **students see only their own**; admins see all |
| GET    | `/api/complaints?status=Pending`  | Yes   | Filter by status (`Pending` / `In Progress` / `Resolved`) |
| GET    | `/api/complaints?category=...`    | Yes   | Filter by category                               |
| GET    | `/api/complaints?search=wifi`     | Yes   | Search by title / ID / description / location   |
| GET    | `/api/complaints/:id`             | Yes   | Single ticket (403 if not owner and not admin)  |
| POST   | `/api/complaints`                 | Yes   | Create new complaint (status defaults to `Pending`) |
| PATCH  | `/api/complaints/:id/status`      | Yes   | Update status (owner or admin only)             |

**GET /api/complaints response:**
```json
{
  "role": "student",
  "count": 3,
  "complaints": [...]
}
```

**Role-based filtering logic:**
- `student` or `faculty` → SQL equivalent of `WHERE submitted_by_id = <current_user_id>`
- `admin` → no filter applied, returns all records

**POST /api/complaints request body:**
```json
{
  "title": "Broken bench in Lecture Hall 3",
  "category": "Infrastructure & Maintenance",
  "priority": "Medium",
  "description": "The bench near row 4 is broken and unsafe to sit on.",
  "location": "Block A, Lecture Hall 3"
}
```

**PATCH /api/complaints/:id/status request body:**
```json
{ "status": "In Progress" }
```

---

### Other
| Method | Endpoint       | Auth?         | Description              |
|--------|----------------|---------------|--------------------------|
| GET    | `/api/health`  | No            | Server health + counts   |
| GET    | `/api/users`   | Yes (admin)   | List all registered users|

---

## Project File Structure

```
server/
├── data/
│   └── campus.json          ← Auto-generated JSON database
├── routes/
│   ├── auth.routes.js       ← POST /api/auth/login | logout | me
│   └── complaints.routes.js ← GET/POST/PATCH /api/complaints
├── auth.js                  ← In-memory session store + middleware
├── db.js                    ← lowdb JSON adapter initialisation
├── seed.js                  ← Seed 8 users + 8 complaints
├── server.js                ← Express app entry point (port 4000)
└── package.json
```
