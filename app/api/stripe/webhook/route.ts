import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { toPlanTier } from "@/lib/membership"
import { getStripe } from "@/lib/server/payments"
import { sendWhatsAppWelcomeMessage } from "@/lib/server/whatsapp"
import { PLAN_DEFINITIONS, isPlanId } from "@/lib/plans"

export async function POST(request: Request) {
  const stripe = getStripe()
  const body = await request.text()
  const signature = (await headers()).get("stripe-signature")
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !endpointSecret) {
    return NextResponse.json({ error: "Webhook configuration missing" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook payload"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const planId = paymentIntent.metadata.planId
      const email = paymentIntent.metadata.email
      const name = paymentIntent.metadata.name
      const phone = paymentIntent.metadata.phone

      if (!isPlanId(planId) || !email) {
        return NextResponse.json({ received: true })
      }

      const user = await prisma.user.upsert({
        where: { email },
        update: { name },
        create: {
          email,
          name,
        },
      })

      const plan = PLAN_DEFINITIONS[planId]

      const membership = await prisma.membership.upsert({
        where: { externalPaymentId: paymentIntent.id },
        update: {
          status: "ACTIVE",
        },
        create: {
          userId: user.id,
          plan: toPlanTier(planId),
          provider: "STRIPE",
          status: "ACTIVE",
          amount: paymentIntent.amount_received,
          currency: paymentIntent.currency.toUpperCase(),
          externalPaymentId: paymentIntent.id,
          externalOrderId: paymentIntent.latest_charge?.toString() ?? null,
        },
      })

      const existingLog = await prisma.transactionLog.findFirst({
        where: {
          paymentId: paymentIntent.id,
          status: "SUCCESS",
          provider: "STRIPE",
        },
      })

      if (!existingLog) {
        await prisma.transactionLog.create({
          data: {
            userId: user.id,
            membershipId: membership.id,
            provider: "STRIPE",
            status: "SUCCESS",
            paymentId: paymentIntent.id,
            orderId: paymentIntent.latest_charge?.toString() ?? null,
            amount: paymentIntent.amount_received,
            currency: paymentIntent.currency.toUpperCase(),
            payload: {
              id: paymentIntent.id,
              planId,
              expectedAmount: plan.stripeAmountInrPaise,
              metadata: paymentIntent.metadata,
            },
          },
        })

        if (phone) {
          try {
            await sendWhatsAppWelcomeMessage({
              phone,
              name,
              planName: plan.name,
            })
          } catch (whatsAppError) {
            console.error("WhatsApp welcome send failed for Stripe membership", whatsAppError)
          }
        }
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await prisma.transactionLog.create({
        data: {
          provider: "STRIPE",
          status: "FAILED",
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount ?? 0,
          currency: (paymentIntent.currency ?? "inr").toUpperCase(),
          payload: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount ?? 0,
            currency: paymentIntent.currency ?? "inr",
            metadata: paymentIntent.metadata,
            lastPaymentError: paymentIntent.last_payment_error
              ? {
                  code: paymentIntent.last_payment_error.code,
                  message: paymentIntent.last_payment_error.message,
                  type: paymentIntent.last_payment_error.type,
                }
              : null,
          },
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handling failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
