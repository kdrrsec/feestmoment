# Database: Neon + Vercel (stappenplan)

Het project gebruikt **PostgreSQL** (via Prisma). **Neon** host de database; jij plakt alleen een **connection string**.

## 1. Neon-project aanmaken

1. Ga naar [https://neon.tech](https://neon.tech) en maak een account (GitHub-login kan).
2. **Create project** — kies een regio dicht bij je klanten (bijv. Frankfurt).
3. Neon maakt automatisch een database (vaak `neondb`).

## 2. Connection string kopiëren

1. In het Neon-dashboard: **Dashboard** → je project → **Connect**.
2. Kies **Connection string** (meestal **psql** of **Prisma**).
3. Kopieer de URL. Die ziet er ongeveer zo uit:

   `postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require`

4. Zet die regel in **`.env.local`** (lokaal) als:

   `DATABASE_URL="...plak hier de hele string..."`

   (Behoud de aanhalingstekens als er speciale tekens in het wachtwoord zitten.)

5. Zelfde variabele **`DATABASE_URL`** in Vercel: **Project → Settings → Environment Variables** (Production + Preview als je wilt).

## 3. Tabellen aanmaken (lokaal)

In de projectmap (scripts laden `DATABASE_URL` uit **`.env.local`**):

```bash
npm run db:migrate:deploy
npm run db:seed
```

*(Alternatief: `npx dotenv-cli -e .env.local -- npx prisma migrate deploy` — Prisma zelf leest geen `.env.local`.)*

Als `npm run dev` nog draait en `prisma generate` een **EPERM**-fout geeft: dev-server even stoppen, daarna `npm run db:generate`.

Start de site: `npm run dev` — inloggen op `/admin/login` met het seed-account (e-mail/wachtwoord zoals in `prisma/seed.ts`, tenzij je die hebt gewijzigd).

## 4. Vercel

- **Build** draait al `prisma migrate deploy` (zie `package.json` → `build`). Eerste deploy na het zetten van `DATABASE_URL` maakt de tabellen op Neon.
- Zet ook op Vercel:
  - `NEXTAUTH_URL` = `https://jouw-domein.nl`
  - `NEXTAUTH_SECRET` = lange random string (nieuw genereren voor productie)
  - `NEXT_PUBLIC_URL` = dezelfde publieke URL

## 5. SQLite oude database

Oude `dev.db` (SQLite) wordt **niet** meer gebruikt. Je kunt `prisma/dev.db` laten staan of verwijderen; de app leest van `DATABASE_URL`.

## Problemen?

- **`P1001` / connection refused** — verkeerde `DATABASE_URL`, of firewall; controleer Neon-dashboard.
- **Migraties** — `npx prisma migrate status` op Neon-URL.
- **Inloggen admin** — `NEXTAUTH_URL` moet exact overeenkomen met de URL in de browser (inclusief `https` op productie).
