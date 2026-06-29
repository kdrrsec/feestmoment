const { execSync } = require("child_process")

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL?.trim()) {
    return { configured: true }
  }
  if (process.env.POSTGRES_PRISMA_URL?.trim()) {
    process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL.trim()
    return { configured: true }
  }
  if (process.env.POSTGRES_URL?.trim()) {
    process.env.DATABASE_URL = process.env.POSTGRES_URL.trim()
    return { configured: true }
  }
  process.env.DATABASE_URL =
    "postgresql://build:build@127.0.0.1:5432/build?schema=public"
  return { configured: false }
}

function run(cmd) {
  execSync(cmd, { stdio: "inherit", env: process.env })
}

const { configured } = resolveDatabaseUrl()

if (!configured) {
  console.log(
    "\nℹ️  Geen database op Vercel — site draait in demo-modus (voorbeeld-assortiment).\n" +
      "   Koppel later Neon via Vercel → Storage → Create Database.\n"
  )
}

run("npx prisma generate")

if (configured) {
  run("npx prisma migrate deploy")
}

run("npx next build")
