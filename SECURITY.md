# SECURITY.md - Public Repository Security Notes

## Known Historical Exposure

### backend/appsettings.json - Password Leak (RESOLVED IN WORKING TREE)

- **What happened:** The initial commit (c619f25) included Password=12345678 in
  backend/appsettings.json. This value was present in all 8 subsequent commits.
- **Exposure level:** The password 12345678 was a local PostgreSQL development password.
  If this was only ever used on a local machine (localhost:5432), the real-world risk is zero
  because that port is not exposed to the internet by default.
- **Current state:** The working tree now uses the placeholder YOUR_LOCAL_DB_PASSWORD.
  The git history still contains the old value.

## Scrubbing Git History (Optional but Recommended)

If the password was ever used against an internet-accessible database, scrub the history:

    pip install git-filter-repo
    echo "12345678==>YOUR_LOCAL_DB_PASSWORD" > replacements.txt
    git filter-repo --replace-text replacements.txt
    git push --force --all origin

After a force-push, contact GitHub support to purge cached blobs from their CDN.

---

## .gitignore Coverage - What Is Intentionally NOT Committed

| Pattern | Reason |
|---|---|
| .env, .env.* | Contains real secrets (API keys, passwords) |
| appsettings.Development.json | May contain local DB passwords |
| appsettings.Production.json | Contains or references production secrets |
| appsettings.*.Local.json | Machine-specific overrides |
| *.pfx, *.pem, *.key | SSL/TLS private keys |
| secrets.json | .NET User Secrets store |
| docker-compose.override.yml | Local port/volume overrides |

## Safe to Commit (Public Repo)

| File | Why it is safe |
|---|---|
| appsettings.json (services/) | Contains only obvious placeholders |
| .env.example | Template only - no real values |
| docker-compose.yml | Architecture config - secrets use env var substitution |
| DEPLOYMENT.md | Documents env var NAMES, not values |

## Pre-Push Security Checklist

Run these before every push to the public repo:

    git status
    git diff --staged --stat
    git diff --staged | Select-String "password|secret|clientid" -CaseSensitive:$false

