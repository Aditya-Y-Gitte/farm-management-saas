# Free-Tier Deployment Guide

**Stack:** Netlify (Frontend) · Render (4 .NET services) · Neon (3 PostgreSQL databases)

> All services run on free tier. Render free instances sleep after 15 minutes of inactivity (cold start ~30s). Neon free tier gives 512 MB storage across all databases.

---

## Prerequisites

- [Neon account](https://neon.tech) (free)
- [Render account](https://render.com) (free)
- [Netlify account](https://netlify.com) (free)
- Google Cloud Console project with OAuth 2.0 credentials

---

## Step 1 — Create Neon Databases

Create **3 separate databases** in Neon (all can be in the same project):

| Database Name | Used by |
|---|---|
| `auth_db` | Auth Service |
| `catalog_db` | Catalog API |
| `production_db` | Production API |

For each database, copy the **connection string** from the Neon dashboard and append `MaxPoolSize=50` to avoid exhausting Neon's connection limit:

```
Host=ep-xyz.us-east-2.aws.neon.tech;Database=auth_db;Username=user;Password=secret;SslMode=Require;MaxPoolSize=50
```

> **Note:** Services run `Database.Migrate()` on startup — schema is created automatically on first boot.

---

## Step 2 — Google OAuth Setup

1. Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add Authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://your-farm-app.netlify.app`
4. Copy Client ID and Client Secret

---

## Step 3 — Deploy Backend Services on Render

Deploy **4 Web Services** on Render using Docker environment.

### Auth Service (deploy first)
- Dockerfile: `services/auth-service/Dockerfile`  Port: `5003`

| Variable | Value |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ConnectionStrings__DefaultConnection` | Neon auth_db connection string + `;MaxPoolSize=50` |
| `Jwt__SecretKey` | Generate: `openssl rand -base64 64` |
| `Jwt__Issuer` | `farm-management-auth` |
| `Jwt__Audience` | `farm-management-api` |
| `Google__ClientId` | From Google Console |
| `Google__ClientSecret` | From Google Console |
| `FrontendUrl` | `https://your-farm-app.netlify.app` |

### Catalog API
- Dockerfile: `services/catalog-api/Dockerfile`  Port: `5001`

| Variable | Value |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ConnectionStrings__DefaultConnection` | Neon catalog_db connection string + `;MaxPoolSize=50` |
| `Jwt__SecretKey` | Same key as auth service |
| `Jwt__Issuer` | `farm-management-auth` |
| `Jwt__Audience` | `farm-management-api` |

### Production API
- Dockerfile: `services/production-api/Dockerfile`  Port: `5002`

| Variable | Value |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ConnectionStrings__DefaultConnection` | Neon production_db connection string + `;MaxPoolSize=50` |
| `Jwt__SecretKey` | Same key as auth service |
| `Jwt__Issuer` | `farm-management-auth` |
| `Jwt__Audience` | `farm-management-api` |

### API Gateway (deploy last)
- Dockerfile: `services/api-gateway/Dockerfile`  Port: `5000`

| Variable | Value |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `Jwt__SecretKey` | Same key as auth service |
| `Jwt__Issuer` | `farm-management-auth` |
| `Jwt__Audience` | `farm-management-api` |
| `FrontendUrl` | `https://your-farm-app.netlify.app` |
| `ServiceUrls__CatalogApi` | `https://farm-catalog-api.onrender.com` |
| `ServiceUrls__ProductionApi` | `https://farm-production-api.onrender.com` |
| `ReverseProxy__Clusters__auth-cluster__Destinations__auth-service__Address` | `https://farm-auth-service.onrender.com` |
| `ReverseProxy__Clusters__catalog-cluster__Destinations__catalog-api__Address` | `https://farm-catalog-api.onrender.com` |
| `ReverseProxy__Clusters__production-cluster__Destinations__production-api__Address` | `https://farm-production-api.onrender.com` |

---

## Step 4 — Deploy Frontend on Netlify

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `build`

| Netlify Env Variable | Value |
|---|---|
| `REACT_APP_GOOGLE_CLIENT_ID` | From Google Console |
| `REACT_APP_API_URL` | *(leave empty — Netlify proxy handles /api/*)* |
| `API_GATEWAY_URL` | `https://farm-api-gateway.onrender.com` |

`netlify.toml` already handles SPA routing + API proxy — no extra config needed.

---

## Step 5 — Final: Update Google Authorized Origins

Add your Netlify URL to Google Cloud Console Authorized JavaScript origins.

---

## Step 6 — Health Check

`curl https://farm-api-gateway.onrender.com/health`

---

## Important Notes

- **JWT_SECRET_KEY must be identical** across all 4 services — generate once with `openssl rand -base64 64`
- **Render free tier cold starts:** First request after 15 min idle takes ~30s. The dashboard metrics endpoint has a 30s timeout to handle this gracefully.
- **MaxPoolSize=50:** Neon free tier has a ~100 connection limit per branch. With 3 services × 50 max connections = up to 150 theoretical connections; Npgsql only opens connections on demand, so in practice 10-20 are used. This setting prevents runaway pooling on service restart loops.
- **Local Docker Compose** still works unchanged: `docker-compose up --build`
