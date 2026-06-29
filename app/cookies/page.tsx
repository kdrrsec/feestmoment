import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookiebeleid",
  description: "Informatie over cookies en functionele websitegegevens bij Feestmoment Verhuur.",
  alternates: { canonical: "/cookies" },
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-[#111111]">Cookiebeleid</h1>
          
          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">Wat zijn cookies?</h2>
              <p className="text-[#666666] leading-relaxed">
                Cookies zijn kleine tekstbestanden die op uw apparaat worden opgeslagen wanneer u onze website bezoekt. 
                Ze helpen ons de website beter te laten functioneren en uw ervaring te verbeteren.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">Welke cookies gebruiken we?</h2>
              <p className="text-[#666666] leading-relaxed">
                We gebruiken functionele cookies die noodzakelijk zijn voor het functioneren van de website, 
                zoals het onthouden van uw winkelmand. We gebruiken geen tracking cookies of advertentie cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">Cookie-instellingen</h2>
              <p className="text-[#666666] leading-relaxed">
                U kunt cookies uitschakelen via de instellingen van uw browser. Houd er rekening mee dat dit 
                de functionaliteit van de website kan beïnvloeden.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
