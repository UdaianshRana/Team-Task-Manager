# Team Task Manager (MERN + Tailwind)

Production-ready team task manager with role-based access using MongoDB, Express, React, and Node.js.

## Features

- JWT authentication (`signup`, `login`)
- Role-based authorization (`Admin`, `Member`)
- Projects and tasks management
- Dashboard metrics (total, completed, overdue, assigned-to-me)
- Search, filtering, and pagination on tasks
- Protected routes, loading states, and API error handling
- Dark mode and toast notifications

## Tech Stack

- Frontend: React, React Router, Axios, Context API, Tailwind CSS
- Backend: Node.js, Express, Mongoose, JWT, bcrypt
- Database: MongoDB

## Backend Setup

1. Go to backend:
   - `cd backend`
2. Create env file:
   - Copy `.env.example` to `.env`
3. Install dependencies:
   - `npm install`
4. Start API:
   - `npm run dev`

API runs on `http://localhost:5000`.

## Frontend Setup

1. Go to frontend:
   - `cd frontend`
2. Create env file:
   - Copy `.env.example` to `.env`
3. Install dependencies:
   - `npm install`
4. Start app:
   - `npm run dev`

Frontend runs on `http://localhost:5173` by default.

## API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Users
- `GET /api/users` (Admin only)

### Projects
- `POST /api/projects` (Admin only)
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id` (Admin only)
- `DELETE /api/projects/:id` (Admin only)

### Tasks
- `POST /api/tasks` (Admin only)
- `GET /api/tasks`
- `PUT /api/tasks/:id` (Admin or assigned user for status updates)
- `DELETE /api/tasks/:id` (Admin only)

## Project Structure

### Backend

- `backend/models`
- `backend/routes`
- `backend/controllers`
- `backend/middleware`
- `backend/config`

### Frontend

- `frontend/src/components`
- `frontend/src/pages`
- `frontend/src/context`
- `frontend/src/services`
- `frontend/src/hooks`

## Notes

- Use strong values for `JWT_SECRET`.
- Avoid exposing `.env` files in version control.
- For production, configure CORS origin restrictions and HTTPS.
