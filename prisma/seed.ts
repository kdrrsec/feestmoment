import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Verwijder lichtletters uit bestaande DB (orders eerst vanwege foreign keys)
  await prisma.rentalOrderItem.deleteMany({
    where: { product: { category: { slug: 'lichtletters' } } },
  })
  await prisma.product.deleteMany({
    where: { category: { slug: 'lichtletters' } },
  })
  await prisma.category.deleteMany({
    where: { slug: 'lichtletters' },
  })

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@feestmomentverhuur.nl' },
    update: {},
    create: {
      email: 'admin@feestmomentverhuur.nl',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created')

  // Create categories
  const categories = [
    { name: 'Ballonnenbogen', slug: 'ballonnenbogen', description: 'Prachtige ballonnenbogen voor elke gelegenheid' },
    { name: 'Decoratie', slug: 'decoratie', description: 'Feestelijke decoraties en accessoires' },
    { name: 'Meubilair', slug: 'meubilair', description: 'Statafels, stoelen en meer' },
    { name: 'Backdrops', slug: 'backdrops', description: 'Fotowanden en achtergronden' },
  ]

  const createdCategories = []
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    createdCategories.push(category)
    console.log(`✅ Category created: ${cat.name}`)
  }

  // Create products
  const products = [
    {
      name: 'Ballonnenboog - Roze & Goud',
      slug: 'ballonnenboog-roze-goud',
      description: 'Prachtige ballonnenboog in roze en goudtinten, perfect voor verjaardagen en bruiloften. Hoogte: 2,5m, breedte: 3m.',
      categorySlug: 'ballonnenbogen',
      pricePerDay: 75,
      deposit: 50,
      stockQty: 3,
      images: ['https://images.unsplash.com/photo-1606800051563-9e0b0c0b8b8b?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Ballonnenboog - Wit & Champagne',
      slug: 'ballonnenboog-wit-champagne',
      description: 'Elegante ballonnenboog in witte en champagne tinten, ideaal voor bruiloften en luxe events.',
      categorySlug: 'ballonnenbogen',
      pricePerDay: 85,
      deposit: 50,
      stockQty: 2,
      images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Ballonnenboog - Regenboog',
      slug: 'ballonnenboog-regenboog',
      description: 'Vrolijke regenboog ballonnenboog voor kinderfeestjes en kleurrijke events.',
      categorySlug: 'ballonnenbogen',
      pricePerDay: 65,
      deposit: 40,
      stockQty: 4,
      images: ['https://images.unsplash.com/photo-1606800051563-9e0b0c0b8b8b?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Statafel - Rond 120cm',
      slug: 'statafel-rond-120cm',
      description: 'Ronde statafel met een diameter van 120cm. Geschikt voor 8-10 personen. Inclusief tafelkleed.',
      categorySlug: 'meubilair',
      pricePerDay: 15,
      deposit: 20,
      stockQty: 20,
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Statafel - Vierkant 80x80cm',
      slug: 'statafel-vierkant-80cm',
      description: 'Vierkante statafel 80x80cm. Perfect voor kleinere groepen. Inclusief tafelkleed.',
      categorySlug: 'meubilair',
      pricePerDay: 12,
      deposit: 15,
      stockQty: 15,
      images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Stoel - Chiavari Goud',
      slug: 'stoel-chiavari-goud',
      description: 'Elegante Chiavari stoel in goudkleur. Perfect voor bruiloften en formele events.',
      categorySlug: 'meubilair',
      pricePerDay: 3.5,
      deposit: 5,
      stockQty: 100,
      images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Stoel - Chiavari Wit',
      slug: 'stoel-chiavari-wit',
      description: 'Klassieke Chiavari stoel in wit. Tijdloos en elegant.',
      categorySlug: 'meubilair',
      pricePerDay: 3.5,
      deposit: 5,
      stockQty: 80,
      images: ['https://images.unsplash.com/photo-1549497538-303791108f95?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Backdrop - Roze Bloesem',
      slug: 'backdrop-roze-bloesem',
      description: 'Romantische fotowand met roze bloesem design. Perfect voor bruiloften en fotoshoots.',
      categorySlug: 'backdrops',
      pricePerDay: 45,
      deposit: 30,
      stockQty: 5,
      images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Backdrop - Goud Geometrisch',
      slug: 'backdrop-goud-geometrisch',
      description: 'Moderne fotowand met goud geometrisch patroon. Luxe uitstraling.',
      categorySlug: 'backdrops',
      pricePerDay: 50,
      deposit: 35,
      stockQty: 4,
      images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Decoratie - Goud Ballonnen Set',
      slug: 'decoratie-goud-ballonnen',
      description: 'Set van 50 goudkleurige ballonnen in verschillende maten. Perfect voor feestelijke decoratie.',
      categorySlug: 'decoratie',
      pricePerDay: 25,
      deposit: 15,
      stockQty: 10,
      images: ['https://images.unsplash.com/photo-1606800051563-9e0b0c0b8b8b?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Decoratie - Lantaarns Set',
      slug: 'decoratie-lantaarns',
      description: 'Set van 20 decoratieve lantaarns in verschillende maten. Ideaal voor sfeervolle verlichting.',
      categorySlug: 'decoratie',
      pricePerDay: 30,
      deposit: 20,
      stockQty: 8,
      images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Decoratie - Garlands Goud',
      slug: 'decoratie-garlands-goud',
      description: 'Goudkleurige slingers en garlands voor tafeldecoratie. Lengte: 5 meter per stuk.',
      categorySlug: 'decoratie',
      pricePerDay: 15,
      deposit: 10,
      stockQty: 15,
      images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Ballonnenboog - Pastel Mix',
      slug: 'ballonnenboog-pastel-mix',
      description: 'Zachte pastelkleurige ballonnenboog in roze, blauw en geel. Perfect voor baby showers en verjaardagen.',
      categorySlug: 'ballonnenbogen',
      pricePerDay: 70,
      deposit: 45,
      stockQty: 3,
      images: ['https://images.unsplash.com/photo-1606800051563-9e0b0c0b8b8b?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Ballonnenboog - Zwart & Goud',
      slug: 'ballonnenboog-zwart-goud',
      description: 'Luxe ballonnenboog in zwart en goud. Perfect voor elegante events en bruiloften.',
      categorySlug: 'ballonnenbogen',
      pricePerDay: 90,
      deposit: 60,
      stockQty: 2,
      images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Statafel - Rechthoekig 120x60cm',
      slug: 'statafel-rechthoekig-120x60',
      description: 'Rechthoekige statafel 120x60cm. Geschikt voor 6-8 personen. Inclusief tafelkleed.',
      categorySlug: 'meubilair',
      pricePerDay: 18,
      deposit: 25,
      stockQty: 12,
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Stoel - Chiavari Zwart',
      slug: 'stoel-chiavari-zwart',
      description: 'Moderne Chiavari stoel in zwart. Elegant en tijdloos.',
      categorySlug: 'meubilair',
      pricePerDay: 3.5,
      deposit: 5,
      stockQty: 60,
      images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Backdrop - Wit Minimalistisch',
      slug: 'backdrop-wit-minimalistisch',
      description: 'Minimalistische witte fotowand. Perfect voor elke gelegenheid en fotoshoots.',
      categorySlug: 'backdrops',
      pricePerDay: 40,
      deposit: 30,
      stockQty: 6,
      images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Backdrop - Roze & Goud Bloemen',
      slug: 'backdrop-roze-goud-bloemen',
      description: 'Romantische fotowand met roze bloemen en goud accenten. Perfect voor bruiloften.',
      categorySlug: 'backdrops',
      pricePerDay: 55,
      deposit: 40,
      stockQty: 3,
      images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Decoratie - Roze Ballonnen Set',
      slug: 'decoratie-roze-ballonnen',
      description: 'Set van 50 roze ballonnen in verschillende maten. Perfect voor verjaardagen en feesten.',
      categorySlug: 'decoratie',
      pricePerDay: 25,
      deposit: 15,
      stockQty: 12,
      images: ['https://images.unsplash.com/photo-1606800051563-9e0b0c0b8b8b?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Decoratie - Goud Confetti',
      slug: 'decoratie-goud-confetti',
      description: 'Goudkleurige confetti set voor tafeldecoratie. Verschillende maten en vormen.',
      categorySlug: 'decoratie',
      pricePerDay: 20,
      deposit: 12,
      stockQty: 20,
      images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&auto=format&fit=crop'],

    },
    {
      name: 'Decoratie - Lantaarns Set Goud',
      slug: 'decoratie-lantaarns-goud',
      description: 'Set van 15 goudkleurige lantaarns. Perfect voor sfeervolle verlichting.',
      categorySlug: 'decoratie',
      pricePerDay: 35,
      deposit: 25,
      stockQty: 6,
      images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80&auto=format&fit=crop'],

    },
  ]

  for (const prod of products) {
    const category = createdCategories.find(c => c.slug === prod.categorySlug)
    if (!category) continue

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: { images: JSON.stringify(prod.images), },
      create: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        categoryId: category.id,
        pricePerDay: prod.pricePerDay,
        deposit: prod.deposit,
        stockQty: prod.stockQty,
        images: JSON.stringify(prod.images),
        active: true,
      },
    })
    console.log(`✅ Product created: ${prod.name}`)
  }

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
