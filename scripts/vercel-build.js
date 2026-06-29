#!/usr/bin/env node
/**
 * Vercel build: laadt .env.production als DATABASE_URL nog niet gezet is.
 */
const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

loadEnvFile(path.join(process.cwd(), ".env.production"))
loadEnvFile(path.join(process.cwd(), ".env"))

if (!process.env.DATABASE_URL?.trim()) {
  if (process.env.POSTGRES_PRISMA_URL?.trim()) {
    process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL.trim()
  } else if (process.env.POSTGRES_URL?.trim()) {
    process.env.DATABASE_URL = process.env.POSTGRES_URL.trim()
  }
}

function run(cmd) {
  execSync(cmd, { stdio: "inherit", env: process.env })
}

const dbUrl = process.env.DATABASE_URL?.trim()

if (!dbUrl) {
  console.error(`
╔══════════════════════════════════════════════════════════════════╗
║  BUILD GESTOPT: DATABASE_URL ontbreekt                           ║
╠══════════════════════════════════════════════════════════════════╣
║  Zet DATABASE_URL in Vercel → Settings → Environment Variables   ║
║  of voeg .env.production toe in de repo (zie VERCEL_ENV.md).      ║
╚══════════════════════════════════════════════════════════════════╝
`)
  process.exit(1)
}

run("npx prisma generate")
run("npx prisma migrate deploy")
run("npx next build")
