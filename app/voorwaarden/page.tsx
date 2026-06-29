import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description:
    "Lees de algemene huurvoorwaarden van Feestmoment Verhuur over reservering, betaling, borg, annulering, aansprakelijkheid en levering.",
  alternates: { canonical: "/voorwaarden" },
}

export default function VoorwaardenPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#111111]">Algemene Voorwaarden</h1>
          <p className="text-sm text-[#666666] mb-8">Laatst bijgewerkt: 15 april 2026</p>

          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">1. Toepasselijkheid</h2>
              <p className="text-[#666666] leading-relaxed">
                Deze algemene voorwaarden zijn van toepassing op alle offertes, reserveringen en huurovereenkomsten
                tussen Feestmoment Verhuur en de huurder. Door een reservering of bestelling te plaatsen gaat de
                huurder akkoord met deze voorwaarden.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">2. Offertes en reserveringen</h2>
              <p className="text-[#666666] leading-relaxed">
                Offertes zijn vrijblijvend, tenzij uitdrukkelijk anders vermeld. Een reservering is definitief na
                bevestiging door Feestmoment Verhuur en/of na ontvangst van (aan)betaling.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">3. Huurperiode en gebruik</h2>
              <p className="text-[#666666] leading-relaxed">
                De huurperiode start en eindigt op de overeengekomen datum en tijd. Gehuurde artikelen moeten correct
                en zorgvuldig worden gebruikt, uitsluitend voor het afgesproken doel en op de afgesproken locatie.
              </p>
              <p className="text-[#666666] leading-relaxed mt-3">
                De huurder is verantwoordelijk voor tijdige retournering of beschikbaarheid voor ophaling. Verlenging
                is alleen mogelijk na voorafgaande toestemming.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">4. Levering, opbouw en risico</h2>
              <p className="text-[#666666] leading-relaxed">
                Indien levering/opbouw is afgesproken, zorgt Feestmoment Verhuur voor uitvoering op het afgesproken
                tijdstip. De huurder blijft verantwoordelijk voor juiste en veilige toegankelijkheid van de locatie.
              </p>
              <p className="text-[#666666] leading-relaxed mt-3">
                Het risico van beschadiging, verlies of diefstal gaat over op de huurder vanaf het moment van
                aflevering tot het moment van retourname.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">5. Betaling en borg</h2>
              <p className="text-[#666666] leading-relaxed">
                Betaling vindt plaats via de aangeboden betaalmethoden en binnen de afgesproken termijn. Feestmoment
                Verhuur kan een borg vragen. De borg wordt na controle van de retour ontvangen artikelen terugbetaald,
                onder aftrek van eventuele schade- of reinigingskosten.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">6. Annulering</h2>
              <p className="text-[#666666] leading-relaxed">
                Annuleren kan kosteloos tot 7 dagen voor de huurdatum, tenzij schriftelijk anders overeengekomen.
                Bij annulering binnen 7 dagen kunnen kosten in rekening worden gebracht op basis van reeds gemaakte
                voorbereidingen, gereserveerde capaciteit en redelijkheid.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">7. Schade en aansprakelijkheid</h2>
              <p className="text-[#666666] leading-relaxed">
                De huurder is aansprakelijk voor schade aan, verlies van of diefstal van gehuurde artikelen tijdens de
                huurperiode. Schade wordt verrekend met de borg of apart gefactureerd.
              </p>
              <p className="text-[#666666] leading-relaxed mt-3">
                Feestmoment Verhuur is niet aansprakelijk voor indirecte schade, gevolgschade of schade door onjuist
                gebruik van gehuurde artikelen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">8. Overmacht</h2>
              <p className="text-[#666666] leading-relaxed">
                In geval van overmacht (zoals extreme weersomstandigheden, ziekte, storingen of andere onvoorziene
                omstandigheden buiten redelijke controle) mag Feestmoment Verhuur de overeenkomst aanpassen, uitstellen
                of annuleren zonder schadeplichtigheid.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">9. Klachten en contact</h2>
              <p className="text-[#666666] leading-relaxed">
                Klachten of vragen over levering of gehuurde artikelen verzoeken wij zo snel mogelijk te melden via
                <a className="underline ml-1" href="mailto:info@feestmomentverhuur.nl">info@feestmomentverhuur.nl</a>.
                Wij streven ernaar om iedere melding zorgvuldig en binnen redelijke termijn af te handelen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-[#111111]">10. Toepasselijk recht</h2>
              <p className="text-[#666666] leading-relaxed">
                Op deze voorwaarden en alle overeenkomsten is Nederlands recht van toepassing. Geschillen worden
                voorgelegd aan de bevoegde rechter in Nederland, tenzij dwingend recht anders bepaalt.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
