# CMS Backend

Spring Boot backend for the blog CMS with:

- PostgreSQL persistence for CMS posts and users
- Session-based login via Spring Security
- Public read endpoints for published CMS posts
- Protected CMS CRUD endpoints under `/api/cms/posts`

## Prerequisites

- Java 17+
- Maven 3.9+
- PostgreSQL 15+ or compatible

## Environment

Copy `.env.example` values into your shell or process manager and change at least:

- `CMS_DB_PASSWORD`
- `CMS_ADMIN_PASSWORD`

The backend seeds one admin user on first boot if `CMS_ADMIN_USERNAME` does not already exist.

## Database

Create a database and user, for example:

```sql
CREATE DATABASE self_website;
CREATE USER self_website WITH PASSWORD 'self_website';
GRANT ALL PRIVILEGES ON DATABASE self_website TO self_website;
```

Schema creation is handled by Hibernate with `spring.jpa.hibernate.ddl-auto=update`.

## Run

```bash
cd backend
mvn spring-boot:run
```

The API listens on `http://localhost:8080` by default.

## Frontend Dev

The Vite frontend proxies `/api` to `http://localhost:8080` by default. If you run the backend elsewhere:

```bash
VITE_CMS_PROXY_TARGET=http://localhost:8081 npm run dev
```

## Endpoints

- `GET /api/posts`
- `GET /api/posts/{slug}`
- `GET /api/auth/session`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/cms/posts`
- `GET /api/cms/posts/{slug}`
- `POST /api/cms/posts`
- `PUT /api/cms/posts/{slug}`
- `DELETE /api/cms/posts/{slug}`
