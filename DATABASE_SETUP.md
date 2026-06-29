# Database Setup Instructies

## Snelle Setup (Aanbevolen)

### Optie 1: Supabase (Gratis Cloud Database)

1. Ga naar https://supabase.com
2. Maak een gratis account
3. Klik op "New Project"
4. Kies een naam en wachtwoord voor je database
5. Wacht tot het project klaar is
6. Ga naar Project Settings → Database
7. Kopieer de "Connection string" (onder "Connection string" → "URI")
8. Plak deze in je `.env` bestand als `DATABASE_URL`

Voorbeeld:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### Optie 2: Neon (Gratis Cloud Database)

1. Ga naar https://neon.tech
2. Maak een gratis account
3. Klik op "Create Project"
4. Kies een naam en regio
5. Kopieer de connection string
6. Plak deze in je `.env` bestand als `DATABASE_URL`

### Optie 3: Lokale PostgreSQL

1. Download en installeer PostgreSQL: https://www.postgresql.org/download/windows/
2. Start PostgreSQL service
3. Open pgAdmin of gebruik command line
4. Maak een nieuwe database:
   ```sql
   CREATE DATABASE feestmomentverhuur;
   ```
5. Update `.env` met:
   ```
   DATABASE_URL="postgresql://postgres:jouw-wachtwoord@localhost:5432/feestmomentverhuur?schema=public"
   ```

## Na Database Setup

1. **Push database schema:**
   ```bash
   npm run db:push
   ```

2. **Seed database met producten:**
   ```bash
   npm run db:seed
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Environment Variabelen

Zorg dat je `.env` bestand de volgende variabelen bevat:

```env
DATABASE_URL="jouw-postgresql-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="een-willekeurige-secret-key"
STRIPE_SECRET_KEY="sk_test_..." (optioneel voor nu)
STRIPE_WEBHOOK_SECRET="whsec_..." (optioneel voor nu)
NEXT_PUBLIC_URL="http://localhost:3000"
```

## Problemen?

- **Database niet bereikbaar:** Controleer of je database server draait
- **Connection refused:** Controleer je DATABASE_URL
- **Permission denied:** Controleer je database gebruikersrechten
