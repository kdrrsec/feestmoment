import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DeleteLeadButton } from "@/components/admin/delete-lead-button"

async function getLeads() {
  try {
    return await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

export default async function AdminLeadsPage() {
  const leads = await getLeads()

  const statusColors: Record<string, string> = {
    NEW: "bg-gray-100 text-gray-700 border border-gray-300",
    CONTACTED: "bg-gray-100 text-gray-800",
    QUOTED: "bg-green-100 text-green-800",
    CONVERTED: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="bg-white">
      <h1 className="text-3xl font-serif font-bold text-[#111111]">Leads</h1>
      <p className="text-sm text-[#666666] mt-2 mb-8 max-w-2xl">
        Hier verschijnen aanvragen van bezoekers die via het{" "}
        <span className="text-[#111111]">contactformulier</span> op de site een bericht sturen (naam,
        e-mail, onderwerp en bericht). Status <code className="text-xs bg-[#F5F5F5] px-1 rounded">NEW</code>{" "}
        is nieuw; later kun je zelf in de database of via een uitbreiding opvolging markeren als
        gecontacteerd / offerte / omgezet.
      </p>

      <div className="space-y-4">
        {leads.length === 0 ? (
          <p className="text-[#666666] py-10 text-center border border-dashed border-[#E5E5E5] rounded-lg">
            Nog geen leads. Zodra iemand het formulier op <strong className="text-[#111111]">/contact</strong>{" "}
            verstuurt, verschijnt het hier.
          </p>
        ) : null}
        {leads.map((lead) => (
          <Card key={lead.id} className="bg-white border border-[#E5E5E5] shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <CardTitle className="text-[#111111]">{lead.name}</CardTitle>
                  <p className="text-sm text-[#666666] mt-1">
                    {lead.email} {lead.phone && `- ${lead.phone}`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Badge className={statusColors[lead.status] || ""}>
                    {lead.status}
                  </Badge>
                  <DeleteLeadButton leadId={lead.id} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {lead.eventDate && (
                <p className="text-sm mb-2">
                  <span className="text-[#666666]">Evenement datum:</span>{" "}
                  {formatDate(lead.eventDate)}
                </p>
              )}
              {lead.budget && (
                <p className="text-sm mb-2">
                  <span className="text-[#666666]">Budget:</span> {lead.budget}
                </p>
              )}
              {lead.message && (
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2 text-[#111111]">Bericht:</p>
                  <p className="text-sm text-[#666666] whitespace-pre-line">
                    {lead.message}
                  </p>
                </div>
              )}
              <p className="text-xs text-[#666666] mt-4">
                Aangemaakt: {formatDate(lead.createdAt)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
