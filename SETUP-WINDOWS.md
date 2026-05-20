# Windows setup — Node.js required

`npm` is not recognized because **Node.js is not installed** (or not on your PATH).  
Cursor includes a private `node.exe` for the editor only — it does **not** include `npm`.

## Step 1 — Install Node.js LTS

1. Open: **https://nodejs.org/**
2. Download the **LTS** Windows Installer (`.msi`) — e.g. **22.x LTS**.
3. Run the installer.
4. Leave these options enabled:
   - **Add to PATH**
   - **npm package manager**
5. Finish installation.

## Step 2 — Restart terminal

Close **all** PowerShell / CMD / Cursor terminal windows, then open a **new** terminal.

Verify:

```powershell
node --version
npm --version
```

You should see versions (e.g. `v22.x.x` and `10.x.x`). If not, reboot Windows once.

## Step 3 — Run the project

```powershell
cd "c:\Users\User\Downloads\nexus tech backup crm etc\nexus-tech-web"
copy .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open **http://localhost:3000/de**

## Admin login (after seed)

Edit `.env` and set `ADMIN_EMAIL` / `ADMIN_PASSWORD`, then run `npm run db:seed` again.

- Backoffice: http://localhost:3000/de/admin  
- Client portal: http://localhost:3000/de/portal  

## Still not working?

- Run PowerShell **as Administrator** only if the installer asked for it.
- Check PATH manually: `C:\Program Files\nodejs\` should exist and contain `node.exe` and `npm.cmd`.
- Add to PATH (System → Environment Variables → Path → New → `C:\Program Files\nodejs`).
