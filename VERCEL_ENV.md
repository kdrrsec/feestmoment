# Vercel environment variables (verplicht voor deploy)

De build faalt met **P1012 / DATABASE_URL not found** als deze variabelen ontbreken.

## Waar instellen

Vercel → jouw project **feestmoment** → **Settings** → **Environment Variables**

Zet elke variabele voor **Production** én **Preview** (vink beide aan).

## Minimaal verplicht

| Name | Value |
|------|--------|
| `DATABASE_URL` | Kopieer uit je lokale `.env.local` (Neon connection string) |
| `NEXTAUTH_SECRET` | Kopieer uit `.env.local` |
| `NEXTAUTH_URL` | `https://feestmoment.vercel.app` (of je echte Vercel-URL) |
| `NEXT_PUBLIC_URL` | Zelfde als `NEXTAUTH_URL` |

## Aanbevolen

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SITE_PHONE` | Jouw telefoonnummer, bv. `+31612345678` |
| `LEAD_NOTIFICATION_EMAIL` | E-mail voor nieuwe leads |
| `RESEND_API_KEY` | Optioneel, voor e-mailnotificaties |

## Na het toevoegen

1. **Redeploy** — Deployments → laatste deploy → **Redeploy** (niet alleen cache, gewoon opnieuw deployen).
2. **Database vullen** (eenmalig, lokaal):

```bash
npm run db:seed
```

Admin: `admin@feestmomentverhuur.nl` / `admin123` (wachtwoord wijzigen op productie).
