# User Manager

A full-stack user management system with a modern Vue 3 + TypeScript frontend and a Go (Gin, Gorm, MySQL) backend. Built with clean architecture, robust testing, and ready for Dockerized deployment.

---

## Tech Stack
- **Frontend:** Vue 3, TypeScript, Element Plus, VeeValidate, Pinia, Tailwind CSS
- **Backend:** Go, Gin, Gorm, MySQL
- **DevOps:** Docker, Docker Compose, Nginx (for SPA), Prometheus (metrics)
- **Testing:** Vitest, @vue/test-utils, testify (Go)

---

## Getting Started (with Docker Compose)

1. **Build and start all services:**
   ```sh
   docker-compose up --build
   ```
   - Frontend: [http://localhost](http://localhost)
   - Backend API: [http://localhost:8080](http://localhost:8080)
   - MySQL: port 3306 (see docker-compose.yml for credentials)

2. **Stop all services:**
   ```sh
   docker-compose down
   ```

---

## Manual Development (without Docker)

### Backend
```sh
cd server
# Set up .env or export DB_* variables as in docker-compose.yml
# Start MySQL locally, then:
go run ./cmd/main.go
```

### Frontend
```sh
cd client
pnpm install
pnpm run dev
```

---

## Running Tests

### Backend (Go)
```sh
cd server
go test ./...
```

### Frontend (Vue)
```sh
cd client
pnpm run test:unit
```

---

## Project Structure
- `client/` — Vue 3 frontend
- `server/` — Go backend
- `docker-compose.yml` — Orchestrates all services

---

## License
MIT 