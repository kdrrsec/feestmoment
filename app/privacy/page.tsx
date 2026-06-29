import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacybeleid",
  description:
    "Lees het privacybeleid van Feestmoment Verhuur (AVG): welke persoonsgegevens we verwerken, waarom, hoe lang en welke rechten u heeft.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#111111]">Privacybeleid</h1>
          <p className="text-sm text-[#666666] mb-8">Laatst bijgewerkt: 15 april 2026</p>

          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">1. Wie wij zijn</h2>
              <p className="text-[#666666] leading-relaxed">
                Feestmoment Verhuur is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in
                dit privacybeleid. Wij verwerken alleen gegevens die nodig zijn voor onze dienstverlening rondom
                verhuur van feest- en eventartikelen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">2. Welke gegevens wij verwerken</h2>
              <p className="text-[#666666] leading-relaxed">
                Afhankelijk van uw aanvraag of bestelling kunnen wij onder andere de volgende persoonsgegevens
                verwerken:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#666666] leading-relaxed">
                <li>Naam en contactgegevens (e-mailadres, telefoonnummer)</li>
                <li>Adres- en locatiegegevens voor levering/opbouw</li>
                <li>Reserverings- en bestelgegevens (producten, data, aantallen)</li>
                <li>Communicatie via contactformulier, e-mail of WhatsApp</li>
                <li>Betaalstatus en transactiereferenties (via betaalprovider)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">3. Waarom wij deze gegevens verwerken</h2>
              <p className="text-[#666666] leading-relaxed">
                Wij verwerken persoonsgegevens uitsluitend op basis van een geldige grondslag, zoals uitvoering van een
                overeenkomst, wettelijke verplichting, gerechtvaardigd belang of toestemming. Concreet gebruiken wij
                gegevens voor:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#666666] leading-relaxed">
                <li>Het verwerken van reserveringen en offertes</li>
                <li>Levering, opbouw en afhandeling van verhuur</li>
                <li>Klantenservice en communicatie over uw aanvraag</li>
                <li>Administratie en naleving van fiscale/wettelijke verplichtingen</li>
                <li>Beveiliging en verbetering van onze website en dienstverlening</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">4. Delen van gegevens met derden</h2>
              <p className="text-[#666666] leading-relaxed">
                Wij verkopen uw gegevens niet. Wij delen persoonsgegevens alleen met partijen die nodig zijn voor onze
                dienstverlening, zoals hosting, e-mailverzending, betaalverwerking of boekhouding. Met verwerkers
                sluiten wij afspraken om uw gegevens te beschermen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">5. Bewaartermijnen</h2>
              <p className="text-[#666666] leading-relaxed">
                Wij bewaren persoonsgegevens niet langer dan nodig is voor het doel waarvoor ze zijn verzameld, tenzij
                een wettelijke bewaarplicht geldt. Administratieve gegevens kunnen bijvoorbeeld langer worden bewaard
                op basis van fiscale verplichtingen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">6. Beveiliging</h2>
              <p className="text-[#666666] leading-relaxed">
                Wij nemen passende technische en organisatorische maatregelen om persoonsgegevens te beschermen tegen
                verlies, misbruik, onbevoegde toegang of onrechtmatige verwerking.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">7. Uw rechten</h2>
              <p className="text-[#666666] leading-relaxed">
                U heeft onder de AVG onder andere het recht op inzage, correctie, verwijdering, beperking van
                verwerking, overdraagbaarheid en bezwaar. Ook kunt u een eerder gegeven toestemming intrekken.
              </p>
              <p className="text-[#666666] leading-relaxed mt-3">
                Verzoeken kunt u sturen naar <a className="underline" href="mailto:info@feestmomentverhuur.nl">info@feestmomentverhuur.nl</a>.
                Wij reageren zo snel mogelijk, uiterlijk binnen de wettelijke termijn.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">8. Cookies en websitegebruik</h2>
              <p className="text-[#666666] leading-relaxed">
                Op onze website gebruiken wij functionele cookies en vergelijkbare technieken die nodig zijn voor een
                goede werking (zoals winkelmandfunctionaliteit). Meer informatie vindt u in ons cookiebeleid.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">9. Wijzigingen in dit beleid</h2>
              <p className="text-[#666666] leading-relaxed">
                Wij kunnen dit privacybeleid van tijd tot tijd wijzigen. De meest actuele versie staat altijd op deze
                pagina. Bij ingrijpende wijzigingen informeren wij u waar nodig aanvullend.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
