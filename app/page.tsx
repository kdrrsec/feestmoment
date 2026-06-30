import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { getPopularProducts } from "@/lib/catalog"
import { 
  Truck, 
  Wrench, 
  Calendar, 
  Star,
  ArrowRight,
  Package,
  CheckCircle
} from "lucide-react"

export const metadata: Metadata = {
  title: "Feestartikelen verhuur voor elk feestmoment",
  description:
    "Huur stijlvolle feest- en eventartikelen zoals ballonnenbogen, decoraties en meubilair. Snelle service en direct offerte aanvragen.",
  alternates: {
    canonical: "/",
  },
}

export default async function Home() {
  const popularProducts = await getPopularProducts(6)

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-1000 motion-reduce:animate-none">
          <Image
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80&auto=format&fit=crop"
            alt="Sfeerbeeld feestdecoratie en event"
            fill
            className="object-cover opacity-25 motion-safe:scale-105 motion-safe:animate-[heroFloat_14s_ease-in-out_infinite] motion-reduce:animate-none"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-white/60"></div>
        </div>
        
        <div className="container relative z-10 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-[#111111] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-reduce:animate-none">
              Uw perfecte feest
              <span className="text-[#C6A76B]">moment</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#666666] mb-12 max-w-2xl mx-auto leading-relaxed motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-200 motion-reduce:animate-none">
              Elegante feest- en eventartikelen voor uw bijzondere momenten. 
              Van ballonnenbogen tot meubilair, wij maken uw feest compleet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-500 motion-reduce:animate-none">
              <Link href="/assortiment">
                <Button size="lg" variant="gold" className="text-lg px-8 py-6">
                  Assortiment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/offerte">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Vraag een offerte aan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Populaire Items Section */}
      {popularProducts.length > 0 && (
        <section className="py-20 bg-[#F8F8F8]">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#111111]">
                Populaire items
              </h2>
              <p className="text-lg text-[#666666] max-w-2xl mx-auto">
                Onze meest gevraagde feestartikelen
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/assortiment">
                <Button variant="outline" size="lg">
                  Bekijk volledig assortiment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Zo werkt het Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#111111]">
              Zo werkt het
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              In drie eenvoudige stappen naar uw perfecte feestmoment
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Kies",
                description: "Bekijk ons assortiment en kies de artikelen die bij uw feest passen. Filter op categorie, prijs en beschikbaarheid.",
                icon: Package,
              },
              {
                step: "02",
                title: "Reserveer",
                description: "Selecteer uw gewenste datum en voeg artikelen toe aan uw winkelmand. Voltooi uw reservering met een veilige betaling.",
                icon: Calendar,
              },
              {
                step: "03",
                title: "Geniet",
                description: "Wij bezorgen en bouwen alles voor u op. U geniet van uw feest, wij halen het daarna weer op.",
                icon: CheckCircle,
              },
            ].map((item, idx) => (
              <Card key={idx} className="text-center border-[#E5E5E5]">
                <CardContent className="pt-8 pb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-[#E5E5E5] mb-6 text-accent-gold">
                    <item.icon className="h-8 w-8 !stroke-accent-gold !fill-accent-gold" />
                  </div>
                  <div className="text-sm font-semibold text-[#666666] mb-2">
                    STAP {item.step}
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-4 text-[#111111]">{item.title}</h3>
                  <p className="text-[#666666] leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Waarom Feestmoment Verhuur Section */}
      <section className="py-20 bg-[#F8F8F8]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#111111]">
              Waarom Feestmoment Verhuur
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Uw betrouwbare partner voor elk feestmoment
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Truck,
                title: "Levering & Ophaling",
                description: "Wij bezorgen en halen uw artikelen op. Ook opbouw en afbouw mogelijk voor een perfecte presentatie.",
              },
              {
                icon: Wrench,
                title: "Opbouw & Afbouw",
                description: "Professionele opbouw en afbouw service. U hoeft zich nergens zorgen over te maken.",
              },
              {
                icon: CheckCircle,
                title: "Kwaliteit & Service",
                description: "Alleen de beste kwaliteit artikelen. Servicegericht en betrouwbaar, voor elk type feest.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="text-center border-[#E5E5E5]">
                <CardContent className="pt-8 pb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F8F8F8] mb-6 text-accent-gold">
                    <item.icon className="h-8 w-8 !stroke-accent-gold !fill-accent-gold" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-3 text-[#111111]">{item.title}</h3>
                  <p className="text-[#666666] leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#111111]">
              Wat onze klanten zeggen
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Echte ervaringen van tevreden klanten
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Sarah de Vries",
                event: "Bruiloft",
                text: "Prachtige ballonnenboog en perfecte service! Alles was op tijd en netjes opgebouwd. Onze gasten waren onder de indruk.",
                rating: 5,
              },
              {
                name: "Mark Janssen",
                event: "Verjaardag",
                text: "Zeer tevreden over de statafels en stoelen. Levering was vlekkeloos en de kwaliteit was uitstekend. Zeker een aanrader!",
                rating: 5,
              },
              {
                name: "Emma Bakker",
                event: "Bedrijfsfeest",
                text: "Professionele aanpak en mooie producten. Van offerte tot afbouw, alles verliep perfect. Zeker een aanrader!",
                rating: 5,
              },
            ].map((review, idx) => (
              <Card key={idx} className="border-[#E5E5E5]">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-[#111111] fill-[#111111]" />
                    ))}
                  </div>
                  <p className="text-[#111111] mb-6 italic leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-[#111111]">{review.name}</p>
                    <p className="text-sm text-[#666666]">{review.event}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="py-20 bg-[#F8F8F8]">
        <div className="container">
          <Card className="max-w-4xl mx-auto border-[#E5E5E5]">
            <CardContent className="pt-12 pb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#111111]">
                Klaar om te beginnen?
              </h2>
              <p className="text-lg text-[#666666] mb-8 max-w-2xl mx-auto">
                Bekijk ons assortiment of vraag een offerte aan voor maatwerk decoraties
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/assortiment">
                  <Button size="lg" className="text-lg px-8">
                    Assortiment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/offerte">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Vraag een offerte aan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
