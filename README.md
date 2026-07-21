# mi-proyecto

CRUD de Tareas: React (Vite) + NestJS + Prisma + PostgreSQL.

## Estructura

```
mi-proyecto/
├── .github/workflows/   # pipelines CI/CD (Fase 4)
├── backend/             # API NestJS + Prisma (con su Dockerfile)
├── frontend/             # React (Vite) (con su Dockerfile)
└── docker-compose.yml    # Postgres, o Postgres+backend+frontend completo
```

## Requisitos

- Node.js 20+
- Docker (para Postgres, y opcionalmente para todo el stack)

## Modo A — nativo (día a día, con hot-reload)

Postgres en Docker, backend y frontend corriendo con Node en tu máquina.

### 1. Base de datos

```bash
docker compose up -d postgres
```

Levanta solo Postgres en `localhost:5432` (ver credenciales en `docker-compose.yml`, son solo para desarrollo local).

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev
```

API en `http://localhost:3000`. Probar `GET /health` → `{ "status": "ok" }`.

Endpoints de `/tareas`:

| Método | Ruta          | Body                              |
|--------|---------------|------------------------------------|
| GET    | `/tareas`     | —                                  |
| GET    | `/tareas/:id` | —                                  |
| POST   | `/tareas`     | `{ titulo, descripcion?, estado? }` |
| PATCH  | `/tareas/:id` | cualquier subconjunto del anterior  |
| DELETE | `/tareas/:id` | —                                  |

`estado` es `"PENDIENTE"` o `"HECHA"`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App en `http://localhost:5173`.

## Modo B — todo dockerizado

Postgres + migración + backend + frontend, todo en contenedores. Útil para
probar que el proyecto corre igual que en un servidor real, sin depender de
lo que tengas instalado en tu máquina.

```bash
docker compose up -d --build
```

Esto:
1. Levanta `postgres` y espera a que su healthcheck esté OK.
2. Corre `migrate` (un contenedor de un solo uso: `prisma migrate deploy`) y espera a que termine.
3. Recién ahí levanta `backend` (`http://localhost:3000`) y `frontend` (`http://localhost:8080`, servido por nginx — a propósito en un puerto distinto al 5173 del modo nativo, para no confundir los dos modos).

Para bajar todo: `docker compose down` (agregá `-v` si además querés borrar los datos de Postgres).

## Variables de entorno

Ningún `.env` se commitea (ver `.gitignore`). Cada carpeta tiene su `.env.example` con las variables necesarias; cada ambiente completa sus propios valores sin tocar código.

En modo dockerizado, el backend y el frontend NO leen `backend/.env` ni
`frontend/.env` — `docker-compose.yml` define sus propias variables
(`environment:` para el backend, `args:` para el frontend), porque adentro
de la red de Docker el hostname de Postgres es `postgres`, no `localhost`.
Mismo código, mismo `ConfigService.get('DATABASE_URL')`, pero la fuente del
valor cambia según cómo lo corras.

## Flujo de trabajo

GitHub Flow: ramas `feat/...` mergeadas a `main`. Los PRs se suman cuando el repo tenga remoto.
prueba de proteccion
