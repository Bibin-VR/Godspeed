import { NextResponse } from "next/server"
import { PLAN_DEFINITIONS, isPlanId } from "@/lib/plans"
import { getStripe } from "@/lib/server/payments"

type CreateIntentPayload = {
  planId: string
  email: string
  name: string
  phone: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateIntentPayload

    if (!isPlanId(body.planId)) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    if (!body.email || !body.name || !body.phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 })
    }

    const selectedPlan = PLAN_DEFINITIONS[body.planId]
    const stripe = getStripe()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: selectedPlan.stripeAmountInrPaise,
      currency: "inr",
      payment_method_types: ["card"],
      metadata: {
        planId: body.planId,
        email: body.email,
        name: body.name,
        phone: body.phone,
        platform: "godspeed",
      },
      receipt_email: body.email,
    })

    if (!paymentIntent.client_secret) {
      return NextResponse.json({ error: "Unable to create payment intent" }, { status: 500 })
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: selectedPlan.stripeAmountInrPaise,
      currency: "inr",
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
