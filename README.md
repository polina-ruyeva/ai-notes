
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

### 2. Backend Setup
```bash
cd backend
go mod tidy
go run main.go
```
Server runs on `http://localhost:3000`

### 3. Frontend Setup
```bash
cd frontend
npm install
ng serve
```
App runs on `http://localhost:4200`