import { NextResponse } from "next/server"
import { PLAN_DEFINITIONS, isPlanId } from "@/lib/plans"
import { getRazorpay } from "@/lib/server/payments"

type CreateOrderPayload = {
  planId: string
  email: string
  name: string
  phone: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderPayload

    if (!isPlanId(body.planId)) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    if (!body.email || !body.name || !body.phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 })
    }

    const plan = PLAN_DEFINITIONS[body.planId]
    const razorpay = getRazorpay()

    const order = await razorpay.orders.create({
      amount: plan.razorpayAmountInrPaise,
      currency: "INR",
      receipt: `godspeed_${body.planId}_${Date.now()}`,
      notes: {
        planId: body.planId,
        email: body.email,
        name: body.name,
        phone: body.phone,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: plan.razorpayAmountInrPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
