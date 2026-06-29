# Vercel deploy — environment variables

**Zet deze NOOIT in Git.** Alleen in Vercel → Settings → Environment Variables (Production + Preview).

## Verplicht (4 stuks)

| Name | Waarde |
|------|--------|
| `DATABASE_URL` | Neon connection string (uit je `.env.local`) |
| `NEXTAUTH_SECRET` | Uit `.env.local` |
| `NEXTAUTH_URL` | `https://jouw-project.vercel.app` |
| `NEXT_PUBLIC_URL` | Zelfde als `NEXTAUTH_URL` |

## Optioneel

| Name | Waarde |
|------|--------|
| `NEXT_PUBLIC_SITE_PHONE` | Telefoonnummer |
| `RESEND_API_KEY` | E-mailnotificaties |
| `LEAD_NOTIFICATION_EMAIL` | Ontvanger leads |

## Na toevoegen

Deployments → **Redeploy**.

Database vullen (eenmalig lokaal): `npm run db:seed`

## Beveiliging

Als credentials ooit in Git stonden: **Neon → Reset password** en gebruik de nieuwe string alleen in Vercel.
