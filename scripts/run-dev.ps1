# Run after Node.js LTS is installed from https://nodejs.org/
$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $ProjectRoot

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "ERROR: npm is not installed or not on PATH." -ForegroundColor Red
    Write-Host "Install Node.js LTS from https://nodejs.org/ then restart this terminal." -ForegroundColor Yellow
    Write-Host "See SETUP-WINDOWS.md in this folder for full steps." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example — edit ADMIN_PASSWORD before production." -ForegroundColor Cyan
}

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
}

if (-not (Test-Path "prisma\dev.db")) {
    Write-Host "Setting up database..." -ForegroundColor Cyan
    npx prisma db push
    npm run db:seed
}

Write-Host "Starting dev server at http://localhost:3000/de" -ForegroundColor Green
npm run dev
