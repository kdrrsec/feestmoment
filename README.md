# Feestmoment Verhuur

Een productieklare website voor verhuur van feest- en eventartikelen, gebouwd met Next.js, TypeScript, Prisma en Stripe.

## Features

- 🛍️ Volledig e-commerce systeem met winkelmand en checkout
- 📅 Beschikbaarheidscontrole per product en datum
- 💳 Stripe integratie (iDEAL, Bancontact, creditcard)
- 👨‍💼 Admin panel voor productbeheer, bestellingen en leads
- 📱 Responsive design met elegante UI
- 🔐 NextAuth voor admin authenticatie
- 📧 Lead management voor offerte aanvragen

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **Database:** PostgreSQL + Prisma
- **Authentication:** NextAuth
- **Payments:** Stripe
- **Email:** Resend (optioneel)

## Setup

### 1. Clone en installeer dependencies

```bash
npm install
```

### 2. Database setup

Maak een PostgreSQL database aan en configureer de `DATABASE_URL` in `.env`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/feestmomentverhuur?schema=public"
```

### 3. Environment variabelen

Kopieer `.env.example` naar `.env` en vul de waarden in:

```bash
cp .env.example .env
```

Vereiste variabelen:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Genereer met: `openssl rand -base64 32`
- `NEXTAUTH_URL` - URL van je applicatie (http://localhost:3000 voor development)
- `STRIPE_SECRET_KEY` - Van je Stripe dashboard
- `STRIPE_WEBHOOK_SECRET` - Voor webhook verificatie
- `NEXT_PUBLIC_URL` - Public URL van je applicatie

### 4. Database migratie en seed

```bash
# Genereer Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database met producten
npm run db:seed
```

De seed script maakt:
- Een admin gebruiker (email: `admin@feestmomentverhuur.nl`, wachtwoord: `admin123`)
- 5 categorieën
- 15 producten

### 5. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## Stripe Webhook Setup

Voor productie moet je Stripe webhooks configureren:

1. Ga naar je Stripe Dashboard → Developers → Webhooks
2. Voeg een endpoint toe: `https://jouw-domein.nl/api/webhooks/stripe`
3. Selecteer events: `checkout.session.completed`, `payment_intent.succeeded`
4. Kopieer de webhook secret naar `STRIPE_WEBHOOK_SECRET` in `.env`

Voor lokale ontwikkeling, gebruik Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Admin Panel

Login op `/admin/login` met:
- Email: `admin@feestmomentverhuur.nl`
- Wachtwoord: `admin123`

**Belangrijk:** Wijzig dit wachtwoord direct in productie!

## Deployment

### Docker

```bash
docker build -t feestmomentverhuur .
docker run -p 3000:3000 --env-file .env feestmomentverhuur
```

### Vercel / Andere platforms

1. Push code naar Git repository
2. Configureer environment variabelen
3. Deploy via platform dashboard
4. Run database migrations: `npm run db:migrate`
5. Seed database: `npm run db:seed`

## Project Structuur

```
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel
│   ├── api/                # API routes
│   ├── assortiment/        # Product listing
│   ├── product/            # Product detail pages
│   └── ...
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   └── admin/              # Admin components
├── lib/                    # Utilities
├── prisma/                 # Prisma schema & migrations
└── public/                 # Static assets
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build voor productie
- `npm run start` - Start productie server
- `npm run db:generate` - Genereer Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio

## Licentie

Privé project - Alle rechten voorbehouden
