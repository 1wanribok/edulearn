# EduLearn – Full Stack Mini Website (Education)

React (Vite) frontend + Spring Boot REST API + PostgreSQL.

## Pages
1. Home – hero, sample timetable, features
2. Courses – loaded from PostgreSQL, search + category filter
3. About – problem statement, tech stack, team
4. Register – validated form saved to `students` table
5. Feedback – ratings saved to `feedback` table, recent entries shown

## Run it
**1. Database** (PostgreSQL 14+)
```
psql -U postgres -f database.sql
```
**2. Backend** (Java 17+, Maven) – defaults: user `postgres`, password `postgres`
```
cd backend
mvn spring-boot:run
```
Override with env vars `DB_URL`, `DB_USER`, `DB_PASSWORD`. Six sample courses are seeded on first run.

**3. Frontend** (Node 18+)
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 (Vite proxies `/api` to port 8080).

## REST API
| Method | Path | Purpose |
|---|---|---|
| GET | /api/courses | list courses |
| POST | /api/students | register (validated, unique email) |
| GET | /api/feedback | latest 10 feedback entries |
| POST | /api/feedback | add feedback |

## Test checklist (for the report)
- Submit Register empty → inline errors appear
- Register twice with same email → "already registered"
- Stop backend → Courses page shows a clear error message
- Resize to phone width → hamburger menu works
