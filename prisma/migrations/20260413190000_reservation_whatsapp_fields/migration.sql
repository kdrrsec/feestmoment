ALTER TABLE "Reservation" ADD COLUMN "source" TEXT NOT NULL DEFAULT 'WHATSAPP';
ALTER TABLE "Reservation" ADD COLUMN "customerName" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "customerPhone" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "notes" TEXT;
