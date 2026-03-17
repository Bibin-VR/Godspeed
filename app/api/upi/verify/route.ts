import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { toPlanTier } from "@/lib/membership"
import { sendWhatsAppWelcomeMessage } from "@/lib/server/whatsapp"
import { PLAN_DEFINITIONS, isPlanId } from "@/lib/plans"

type VerifyUpiPayload = {
  planId: string
  email: string
  name: string
  phone: string
  utr: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyUpiPayload

    if (!isPlanId(body.planId)) {
      return NextResponse.json({ error: "Invalid plan selected", verified: false }, { status: 400 })
    }

    if (!body.email || !body.name || !body.phone || !body.utr) {
      return NextResponse.json({ error: "Name, email, phone, and UTR are required", verified: false }, { status: 400 })
    }

    const utr = body.utr.trim().toUpperCase()
    if (utr.length < 8) {
      return NextResponse.json({ error: "Invalid UTR format", verified: false }, { status: 400 })
    }

    const plan = PLAN_DEFINITIONS[body.planId]

    const user = await prisma.user.upsert({
      where: { email: body.email },
      update: { name: body.name },
      create: {
        email: body.email,
        name: body.name,
      },
    })

    const membership = await prisma.membership.upsert({
      where: { externalPaymentId: utr },
      update: {
        status: "ACTIVE",
        amount: plan.upiAmountInrPaise,
        currency: "INR",
      },
      create: {
        userId: user.id,
        plan: toPlanTier(body.planId),
        provider: "UPI",
        status: "ACTIVE",
        amount: plan.upiAmountInrPaise,
        currency: "INR",
        externalPaymentId: utr,
      },
    })

    const existingLog = await prisma.transactionLog.findFirst({
      where: {
        paymentId: utr,
        provider: "UPI",
        status: "SUCCESS",
      },
    })

    if (!existingLog) {
      await prisma.transactionLog.create({
        data: {
          userId: user.id,
          membershipId: membership.id,
          provider: "UPI",
          status: "SUCCESS",
          paymentId: utr,
          amount: plan.upiAmountInrPaise,
          currency: "INR",
          payload: {
            planId: body.planId,
            utr,
            amount: plan.upiAmountInrPaise,
            method: "upi",
          },
        },
      })

      try {
        await sendWhatsAppWelcomeMessage({
          phone: body.phone,
          name: body.name,
          planName: plan.name,
        })
      } catch (whatsAppError) {
        console.error("WhatsApp welcome send failed for UPI membership", whatsAppError)
      }
    }

    return NextResponse.json({ verified: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ verified: false, error: message }, { status: 500 })
  }
}
