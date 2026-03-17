import crypto from "node:crypto"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { toPlanTier } from "@/lib/membership"
import { sendWhatsAppWelcomeMessage } from "@/lib/server/whatsapp"
import { PLAN_DEFINITIONS, isPlanId } from "@/lib/plans"

type VerifyPayload = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  planId: string
  email: string
  name: string
  phone: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyPayload

    if (!isPlanId(body.planId)) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    if (!body.email || !body.name || !body.phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      return NextResponse.json({ error: "Razorpay secret not configured" }, { status: 500 })
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
      .digest("hex")

    if (expectedSignature !== body.razorpay_signature) {
      return NextResponse.json({ verified: false, error: "Invalid signature" }, { status: 400 })
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

    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        plan: toPlanTier(body.planId),
        provider: "RAZORPAY",
        status: "ACTIVE",
        amount: plan.razorpayAmountInrPaise,
        currency: "INR",
        externalPaymentId: body.razorpay_payment_id,
        externalOrderId: body.razorpay_order_id,
      },
    })

    await prisma.transactionLog.create({
      data: {
        userId: user.id,
        membershipId: membership.id,
        provider: "RAZORPAY",
        status: "SUCCESS",
        paymentId: body.razorpay_payment_id,
        orderId: body.razorpay_order_id,
        amount: plan.razorpayAmountInrPaise,
        currency: "INR",
        payload: body,
      },
    })

    try {
      await sendWhatsAppWelcomeMessage({
        phone: body.phone,
        name: body.name,
        planName: plan.name,
      })
    } catch (whatsAppError) {
      console.error("WhatsApp welcome send failed for Razorpay membership", whatsAppError)
    }

    return NextResponse.json({ verified: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ verified: false, error: message }, { status: 500 })
  }
}
