# Nexus Tech CH — Web Application

Light teal UI (Inter + DM Serif). Production deploy: commit `94ea9e3` or later.

Modern Next.js site for **Nexus Tech Schweiz**: marketing (DE/EN), lead capture, **client portal** (BTC/EUR balances, live markets), and **admin backoffice** (clients, withdrawals, system notices).

## Features

- Marketing homepage (crypto recovery / forensics theme)
- DE / EN (`next-intl`)
- Client portal: EUR balance (market or admin-set), BTC, live crypto/FX ticker, bank account, withdrawal requests
- Admin backoffice: manage clients, balances, per-client messages, approve withdrawals
- NextAuth credentials login

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM (SQLite local · PostgreSQL recommended for production)
- NextAuth.js

## Quick start (local)

```bash
cp .env.example .env    # Windows: copy .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```

| URL | Purpose |
|-----|---------|
| http://localhost:3000/de | Homepage |
| http://localhost:3000/de/portal | Client login |
| http://localhost:3000/de/admin | Backoffice (not in public nav) |

**Admin login:** use `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`, then run `npm run db:seed`.

## Environment variables

See `.env.example`. Required:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` (for seed only)

## Production database (PostgreSQL)

For Vercel, Railway, or VPS production, change `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then:

```bash
npx prisma migrate dev --name init
npm run db:seed
```

Use a hosted Postgres URL (e.g. [Neon](https://neon.tech), Supabase, Railway).

## Deploy

| Platform | Notes |
|----------|--------|
| **Vercel + Neon** | Easiest for Next.js; point Namecheap DNS to Vercel |
| **Railway / Render** | App + Postgres in one project |
| **VPS** (Namecheap, Hetzner, DO) | Node 20, PM2, nginx, PostgreSQL — see `SETUP-WINDOWS.md` for local dev |

**Not supported:** Namecheap shared/cPanel-only hosting (PHP static).

## Project structure

```
src/app/[locale]/     Pages (de, en)
src/app/api/          Leads, contact, portal, admin APIs
src/components/       UI
prisma/               Schema + seed
messages/             i18n (de.json, en.json)
public/               Static assets
```

## Legacy redirects

`next.config.ts` redirects old PHP/HTML URLs (`/contact.php`, `/index.html`, etc.) to new locale routes.

## Security

- Rotate any secrets that ever lived in old PHP files
- Never commit `.env` or `.db` files
- Change default admin password before production
- Use HTTPS and strong `NEXTAUTH_SECRET` in production

## Upload to GitHub

See **GITHUB-UPLOAD.md** in this folder.

## License

Proprietary — Nexus Tech CH. All rights reserved unless you specify otherwise.
