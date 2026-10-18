# React + .NET Starter

[![Build](https://github.com/varunkonnojutech-lab/react-dotnet-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/varunkonnojutech-lab/react-dotnet-starter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4)](https://dotnet.microsoft.com/download/dotnet/8.0)
[![React 18](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/varunkonnojutech-lab/react-dotnet-starter)

A full-stack starter template: a **React 18 + Vite + TypeScript** frontend talking to a **.NET 8 Web API** backend with JWT authentication and per-user todos. The companion repo [angular-dotnet-starter](https://github.com/varunkonnojutech-lab/angular-dotnet-starter) shows the same backend paired with Angular 18.

## Who is this for

Anyone who wants a working full-stack app to learn from or to clone as the starting point for a real project — frontend developers meeting .NET for the first time, and backend developers meeting React. If you can build a REST API, this shows you how a modern SPA consumes it securely.

## What you'll learn

**Backend (`backend/`, .NET 8)**
- Register / login with JWT bearer authentication (8-hour tokens)
- Per-user todo CRUD, scoped via the `sub` claim — users only see their own todos
- EF Core InMemory database (zero setup), Swagger UI
- CORS configured for the Vite dev server (`http://localhost:5173`)
- Salted SHA-256 password hashing — **demo-grade only** (see note below)

**Frontend (`frontend/`, React 18 + Vite 5 + TypeScript)**
- React Router v6 with a `ProtectedRoute` guard
- `AuthContext` with token persistence in `localStorage`
- Typed `fetch` API client that attaches the Bearer token automatically
- Login, Register, and Todos pages (add / toggle / delete)

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/) and npm

## Quick start

**Option A — one click:** hit the **Codespaces** badge above. It opens a browser-based environment with .NET 8 and Node 20 preinstalled — then run the two commands below in separate terminals.

**Option B — locally:**

**1. Start the backend:**

```bash
cd backend
dotnet run
```

The API listens on `https://localhost:7301` (fixed in `Properties/launchSettings.json`).
Swagger UI: `https://localhost:7301/swagger`

**2. Start the frontend (new terminal):**

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` → register an account → add some todos.

> If the backend prints a different port, update `API_BASE` in
> `frontend/src/api/client.ts` to match.

## How it works

1. You register at `/register` — the API hashes your password, creates the user, and returns a JWT.
2. The React app stores the JWT in `localStorage` and the `fetch` wrapper attaches it as a `Bearer` header on every request.
3. `TodosController` reads the `sub` claim from the token, so every query is automatically scoped to *your* todos — one user can never see another's.
4. `ProtectedRoute` checks for a token before rendering `/todos`; without one you're redirected to `/login`.

**Demo flow:** register → add, complete, and delete todos → refresh (the session persists via the stored token) → sign out → try opening `/todos` directly and watch the guard redirect you.

## Project structure

```
react-dotnet-starter/
├── backend/                  # .NET 8 Web API
│   ├── Controllers/          # AuthController, TodosController
│   ├── Data/                 # AppDbContext (EF Core InMemory)
│   ├── Dtos/                 # Record-type request/response DTOs
│   ├── Models/               # User, Todo entities
│   ├── Services/             # JwtTokenService, PasswordHasher
│   ├── Properties/           # launchSettings.json (fixed dev ports)
│   └── appsettings.json      # Jwt key/issuer/audience
└── frontend/                 # React 18 + Vite + TypeScript
    ├── src/
    │   ├── api/client.ts     # Typed fetch wrapper (attaches Bearer token)
    │   ├── auth/             # AuthContext (login/register/logout)
    │   ├── components/       # ProtectedRoute
    │   └── pages/            # Login, Register, Todos
    ├── vite.config.ts        # Dev server on :5173
    └── index.html
```

## API endpoints

| Method | Endpoint              | Auth | Description              |
| ------ | --------------------- | ---- | ------------------------ |
| POST   | `/api/auth/register`  | No   | Register, returns JWT    |
| POST   | `/api/auth/login`     | No   | Login, returns JWT       |
| GET    | `/api/todos`          | Yes  | List current user's todos |
| POST   | `/api/todos`          | Yes  | Create a todo            |
| PUT    | `/api/todos/{id}`     | Yes  | Update title / done flag |
| DELETE | `/api/todos/{id}`     | Yes  | Delete a todo            |

## Security note

`PasswordHasher` uses salted SHA-256 and is marked **demo-grade** in code.
For production, use PBKDF2, bcrypt, or ASP.NET Core Identity's `PasswordHasher`,
enforce HTTPS-only cookies instead of `localStorage`, and move the JWT key
into user secrets or Azure Key Vault.

## Next steps

Continue the learning path with [grpc-dotnet](https://github.com/varunkonnojutech-lab/grpc-dotnet) — swap REST for contract-first gRPC services and see how microservices talk to each other efficiently.

## License

MIT — see [LICENSE](LICENSE).
