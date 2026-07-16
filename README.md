# mi-proyecto

CRUD de Tareas: React (Vite) + NestJS + Prisma + PostgreSQL.

## Estructura

```
mi-proyecto/
├── .github/workflows/   # pipelines CI/CD (Fase 4)
├── backend/             # API NestJS + Prisma
├── frontend/             # React (Vite)
└── docker-compose.yml    # PostgreSQL para desarrollo local
```

## Requisitos

- Node.js 20+
- Docker (para levantar PostgreSQL)

## Levantar el proyecto en local

### 1. Base de datos

```bash
docker compose up -d
```

Levanta PostgreSQL en `localhost:5432` (ver credenciales en `docker-compose.yml`, son solo para desarrollo local).

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev
```

API en `http://localhost:3000`. Probar `GET /health` → `{ "status": "ok" }`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App en `http://localhost:5173`.

## Variables de entorno

Ningún `.env` se commitea (ver `.gitignore`). Cada carpeta tiene su `.env.example` con las variables necesarias; cada ambiente completa sus propios valores sin tocar código.

## Flujo de trabajo

GitHub Flow: ramas `feat/...` mergeadas a `main`. Los PRs se suman cuando el repo tenga remoto.
