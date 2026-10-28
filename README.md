# Hostel Management System — MERN Stack

A full-stack hostel administration app built with MongoDB, Express, React, and Node.js.

## Features
- Admin registration/login with JWT authentication and bcrypt password hashing
- Protected backend APIs and role-ready authorization middleware
- Dashboard statistics for students, rooms, occupancy, and fee payments
- Student CRUD with search
- Room CRUD, capacity and occupancy tracking
- Room allocation and deallocation
- Hostel fee records, payment status, and payment marking
- Responsive React UI with sidebar navigation, tables, forms, and dashboard cards

## Requirements
- Node.js 18+
- MongoDB local installation or MongoDB Atlas connection
- npm

## 1. Configure the backend
```bash
cd server
cp .env.example .env
```
Edit `.env` and set `MONGO_URI` and a long random `JWT_SECRET`.

## 2. Install and run backend
```bash
npm install
npm run dev
```
Backend defaults to `http://localhost:5000`.

## 3. Install and run frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## First admin account
Use **Create admin account** on the login screen. For a real deployment, disable public registration after creating the initial admin, or implement an invitation flow.

## API overview
- `POST /api/auth/register` — create admin
- `POST /api/auth/login` — login
- `GET /api/auth/me` — current account
- `/api/students` — student CRUD
- `/api/rooms` — room CRUD
- `/api/allocations` — room allocation/deallocation
- `/api/fees` — fee records and payment updates
- `GET /api/dashboard` — dashboard metrics

All endpoints except register/login require `Authorization: Bearer <token>`.

## Production notes
- Configure a strong `JWT_SECRET`, HTTPS, CORS allow-list, database backups, and rate limiting.
- Registration is open in this starter for convenient first-time setup. Restrict it before public deployment.
- This is a starter application: validate local legal, privacy, and operational requirements before using real student data.
