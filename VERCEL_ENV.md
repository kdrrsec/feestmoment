# Vercel deploy

## Snel live (zonder database)

De site kan **zonder** `DATABASE_URL` deployen. Assortiment toont dan **voorbeeldproducten** (demo-modus).

Homepage, Over ons, Contact en Offerte werken. Admin en formulieren die data opslaan werken pas met database.

## Database koppelen (aanbevolen)

Vercel heeft geen eigen database — je koppelt **Neon** (gratis):

1. Vercel → project **feestmoment** → **Storage** tab
2. **Create Database** → kies **Neon**
3. Volg de stappen — Vercel zet automatisch `DATABASE_URL` (en `POSTGRES_URL`)
4. **Redeploy**

Daarna lokaal eenmalig: `npm run db:seed` (met productie-URL in `.env.local`).

### Handmatig (alternatief)

Settings → **Environment Variables** → Production + Preview:

| Name | Value |
|------|--------|
| `DATABASE_URL` | Neon connection string |
| `NEXTAUTH_SECRET` | Random string |
| `NEXTAUTH_URL` | `https://jouw-site.vercel.app` |
| `NEXT_PUBLIC_URL` | Zelfde URL |

**Nooit** database-wachtwoorden in Git zetten.

## Admin

`admin@feestmomentverhuur.nl` / `admin123` — alleen na `db:seed` met database.
