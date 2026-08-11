# SECURITY.md

This document defines what is and is not committed to this public repository,
and how to verify that before every push.

---

## .gitignore Coverage — What Is Never Committed

| Pattern | Reason |
|---|---|
| `.env`, `.env.*` | Contains real secrets (API keys, DB passwords) |
| `appsettings.Development.json` | May contain local developer DB credentials |
| `appsettings.Production.json` | References or contains production secrets |
| `appsettings.Staging.json` | Same as above |
| `appsettings.*.Local.json` | Machine-specific overrides |
| `*.pfx`, `*.p12`, `*.pem`, `*.key` | SSL/TLS private keys |
| `secrets.json` | .NET User Secrets store |
| `docker-compose.override.yml` | Local port/volume overrides |

---

## Safe to Commit (Public)

| File | Why it is safe |
|---|---|
| `services/*/appsettings.json` | Placeholder values only — no real credentials |
| `.env.example` | Template of variable names, no real values |
| `docker-compose.yml` | Uses `${VAR}` substitution — secrets stay in `.env` |
| `DEPLOYMENT.md` | Documents env var **names**, not values |

---

## Pre-Push Checklist

Run these before every `git push` to the public repo:

```bash
# 1. Confirm no secret files are staged
git status

# 2. Spot-check staged diff for sensitive strings
git diff --staged | Select-String "password|secret|clientid|apikey" -CaseSensitive:$false

# 3. Confirm .env files are gitignored (should print the .gitignore rule, not "?? frontend/.env")
git check-ignore -v frontend/.env
```

