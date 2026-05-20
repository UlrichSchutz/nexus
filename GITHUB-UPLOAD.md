# Upload to GitHub

This folder is a **clean copy** of the Nexus Tech web app, ready for GitHub.

**Excluded (on purpose):** `node_modules`, `.next`, `.env`, SQLite database files, logs.

---

## 1. Create a new repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Name e.g. `nexus-tech-web`
3. **Private** recommended (client portal + admin)
4. Do **not** add README, .gitignore, or license (this folder already has them)

---

## 2. Push from your PC

Open PowerShell in **this folder**:

```powershell
cd "c:\Users\User\Downloads\nexus tech backup crm etc\nexus-tech-github"

git init
git add .
git commit -m "Initial commit: Nexus Tech web app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexus-tech-web.git
git push -u origin main
```

Replace `YOUR_USERNAME` and repo name with yours.

---

## 3. After upload — deploy (Vercel example)

1. [vercel.com](https://vercel.com) → Import Git repository
2. **Root directory:** leave as repo root (this folder is the project root)
3. Add environment variables from `.env.example`
4. For production database, switch Prisma to PostgreSQL (see `README.md` → Deploy)

---

## 4. Never commit

- `.env` (real passwords, `NEXTAUTH_SECRET`, Telegram tokens)
- `*.db` files
- Old `public_html` backup with `leads.txt` / `contact.log`

---

## Local development (after clone)

```powershell
copy .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000/de
