import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await prisma.lead.deleteMany({
      where: { id: params.id },
    })

    if (result.count === 0) {
      return NextResponse.json({ error: "Lead niet gevonden" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("admin leads DELETE:", e)
    return NextResponse.json({ error: "Verwijderen mislukt" }, { status: 500 })
  }
}
