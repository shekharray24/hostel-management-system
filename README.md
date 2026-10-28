# Hostel Management System

A full-stack **Hostel Management System** built with the MERN stack to help hostel administrators manage students, rooms, room allocations, and fee payments from one dashboard.

**Repository:** [shekharray24/hostel-management-system](https://github.com/shekharray24/hostel-management-system)

## Features

- **Admin authentication** — register and log in with JWT-based authentication and bcrypt password hashing.
- **Dashboard** — view summary statistics for students, rooms, occupancy, and fee payments.
- **Student management** — create, view, update, delete, and search student records.
- **Room management** — manage rooms and track capacity, occupancy, and availability.
- **Room allocation** — allocate rooms to students and manage deallocation.
- **Fee management** — maintain hostel fee records, view payment status, and mark payments.
- **Responsive interface** — React dashboard with navigation, tables, forms, and summary cards.
- **Protected APIs** — backend endpoints are protected by authentication middleware, except registration and login.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Backend | Node.js, Express |
| Database | MongoDB |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Package manager | npm |

## Project Structure

```text
hostel-management-system/
├── client/        # React + Vite frontend
│   └── src/
├── server/        # Express backend
│   └── src/
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) (version 18 or newer)
- npm (included with Node.js)
- [MongoDB](https://www.mongodb.com/) locally, or a MongoDB Atlas database

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shekharray24/hostel-management-system.git
cd hostel-management-system
```

### 2. Configure and start the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory and configure your database URI and JWT secret:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

Use the variable names expected by the server configuration. Never commit your actual `.env` file or credentials.

Start the backend:

```bash
npm run dev
```

The backend is configured to use `http://localhost:5000` by default.

### 3. Configure and start the frontend

Open a **second terminal** from the project root:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite (commonly [http://localhost:5173](http://localhost:5173)).

## API Overview

The backend provides endpoints for these resources:

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/register` | Register an admin account |
| `POST /api/auth/login` | Log in |
| `GET /api/auth/me` | Get the authenticated account |
| `/api/students` | Student management |
| `/api/rooms` | Room management |
| `/api/allocations` | Room allocation and deallocation |
| `/api/fees` | Fee records and payment updates |
| `GET /api/dashboard` | Dashboard metrics |

Except for registration and login, API requests require an access token in the header:

```http
Authorization: Bearer <token>
```

## Security Notes

- Use a long, unique `JWT_SECRET` and keep credentials in environment variables.
- Restrict admin registration before exposing the application publicly.
- Configure production CORS rules, HTTPS, rate limiting, and database backups before deployment.
- Do not use real student data until suitable privacy, security, and operational requirements have been reviewed.

## Future Improvements

Possible enhancements include role-based permissions, email or SMS notifications, downloadable reports, and deployment configuration.

## License

No license has been specified yet. Contact the repository owner before reusing or distributing this project.
