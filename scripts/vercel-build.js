#!/usr/bin/env node
/**
 * Vercel build: vereist DATABASE_URL in project environment variables.
 * Zie VERCEL_ENV.md als de build faalt.
 */
const { execSync } = require("child_process")

function run(cmd) {
  execSync(cmd, { stdio: "inherit", env: process.env })
}

const dbUrl = process.env.DATABASE_URL?.trim()

if (!dbUrl) {
  console.error(`
╔══════════════════════════════════════════════════════════════════╗
║  BUILD GESTOPT: DATABASE_URL ontbreekt op Vercel                 ║
╠══════════════════════════════════════════════════════════════════╣
║  1. Vercel → feestmoment → Settings → Environment Variables      ║
║  2. Name:  DATABASE_URL                                          ║
║  3. Value: Neon connection string (uit je .env.local)            ║
║  4. Vink aan: Production + Preview                               ║
║  5. Save → Deployments → Redeploy                                ║
║                                                                  ║
║  Zie ook VERCEL_ENV.md in de repo.                               ║
╚══════════════════════════════════════════════════════════════════╝
`)
  process.exit(1)
}

run("npx prisma generate")
run("npx prisma migrate deploy")
run("npx next build")
