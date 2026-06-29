import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StoryVideo } from "@/components/story-video"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Truck, 
  Wrench, 
  CheckCircle, 
  ArrowRight,
  Award,
  Users
} from "lucide-react"

export default function OverOnsPage() {
  return (
    <div className="flex flex-col bg-white">
      {/* Verhaal Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-[#111111]">
                  Ons verhaal
                </h2>
                <div className="space-y-4 text-[#666666] leading-relaxed">
                  <p>
                    Bij Feestmoment Verhuur geloven we dat elk feestmoment uniek is en de perfecte 
                    decoratie verdient. Met jarenlange ervaring in de eventsector bieden wij een 
                    uitgebreid assortiment aan elegante feestartikelen.
                  </p>
                  <p>
                    Van prachtige ballonnenbogen tot stijlvol meubilair, wij hebben alles wat u nodig 
                    heeft om uw feest tot een onvergetelijke ervaring te maken. Onze focus ligt op 
                    kwaliteit, service en betrouwbaarheid.
                  </p>
                  <p>
                    Of het nu gaat om een intieme bruiloft, een groot bedrijfsfeest of een gezellige 
                    verjaardag, wij zorgen ervoor dat uw feestmoment perfect is.
                  </p>
                </div>
              </div>
              <StoryVideo
                src="/videos/over-ons-verhaal.mp4"
                title="Feestmoment Verhuur"
              />
            </div>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-20 bg-[#F8F8F8]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#111111]">
              Waarom kiezen voor ons
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Wat ons onderscheidt van anderen
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Award,
                title: "Kwaliteit",
                description: "Alleen de beste kwaliteit artikelen. Wij selecteren zorgvuldig elk item in ons assortiment.",
              },
              {
                icon: Truck,
                title: "Service",
                description: "Levering, ophaling, opbouw en afbouw. Wij zorgen voor een complete service.",
              },
              {
                icon: CheckCircle,
                title: "Betrouwbaarheid",
                description: "U kunt op ons rekenen. Punctueel, professioneel en altijd met een glimlach.",
              },
              {
                icon: Users,
                title: "Ervaring",
                description: "Jarenlange ervaring in de eventsector. Wij kennen de ins en outs van elk type feest.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="text-center border-[#E5E5E5]">
                <CardContent className="pt-8 pb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F8F8F8] mb-6 text-accent-gold">
                    <item.icon className="h-8 w-8 !stroke-accent-gold !fill-accent-gold" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-3 text-[#111111]">{item.title}</h3>
                  <p className="text-[#666666] leading-relaxed text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Werkwijze Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#111111]">
              Onze werkwijze
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Van eerste contact tot perfecte afronding
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Consultatie",
                  description: "We bespreken uw wensen en behoeften. Samen bepalen we wat het beste bij uw feest past.",
                },
                {
                  step: "2",
                  title: "Offerte & Reservering",
                  description: "U ontvangt een duidelijke offerte. Na akkoord reserveren we de artikelen voor uw datum.",
                },
                {
                  step: "3",
                  title: "Voorbereiding",
                  description: "Wij bereiden alles zorgvuldig voor. Alle artikelen worden gecontroleerd en klaargemaakt.",
                },
                {
                  step: "4",
                  title: "Levering & Opbouw",
                  description: "Op de afgesproken dag bezorgen en bouwen wij alles voor u op. Alles staat perfect.",
                },
                {
                  step: "5",
                  title: "Afronding",
                  description: "Na uw feest halen wij alles weer op. U geniet na, wij ruimen op.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-[#111111] text-[#111111] flex items-center justify-center font-serif font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-serif text-xl font-semibold mb-2 text-[#111111]">{item.title}</h3>
                    <p className="text-[#666666] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
