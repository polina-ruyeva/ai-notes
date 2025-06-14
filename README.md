
# Task Manager with AI Notes Integration

Simple Task Manager application with Go backend and Angular frontend.

## Quick Start

### 1. Database Setup
```bash
docker-compose up -d
```

This starts PostgreSQL on port 5432 with:
- User: `user`
- Password: `password`
- Database: `ainotes`

### 2. Environment Variables

Create `.env` in backend directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=user
DB_PASSWORD=password
DB_NAME=ainotes
```

### 3. Backend Setup
```bash
cd backend
go mod tidy
go run main.go
```
Server runs on `http://localhost:3000`

### 4. Frontend Setup
```bash
cd frontend
npm install
ng serve
```
App runs on `http://localhost:4200`