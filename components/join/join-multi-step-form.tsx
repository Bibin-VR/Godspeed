"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { PLAN_DEFINITIONS, type PlanId } from "@/lib/plans"
import { PricingCards } from "@/components/join/pricing-cards"
import { StripeCheckoutForm } from "@/components/join/stripe-checkout-form"

type PaymentMethod = "stripe" | "razorpay"

type CreateIntentResponse = {
  clientSecret: string
}

type CreateOrderResponse = {
  orderId: string
  amount: number
  currency: string
  keyId: string
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void
    }
  }
}

const stripePromise =
  typeof window === "undefined" || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? null
    : loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return false
  if (window.Razorpay) return true

  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const steps = ["Plan", "Details", "Payment"] as const

export function JoinMultiStepForm() {
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("starter")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe")
  const [clientSecret, setClientSecret] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [busy, setBusy] = useState(false)

  const selectedPlanInfo = useMemo(() => PLAN_DEFINITIONS[selectedPlan], [selectedPlan])

  function toNextStep() {
    if (step < 3) setStep((prev) => prev + 1)
  }

  function toPreviousStep() {
    if (step > 1) setStep((prev) => prev - 1)
  }

  async function prepareStripePayment() {
    const response = await fetch("/api/stripe/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: selectedPlan,
        name,
        email,
        phone,
      }),
    })

    const data = (await response.json()) as CreateIntentResponse & { error?: string }

    if (!response.ok || !data.clientSecret) {
      throw new Error(data.error ?? "Unable to initialize Stripe")
    }

    setClientSecret(data.clientSecret)
  }

  async function handleRazorpay() {
    const loaded = await loadRazorpayScript()
    if (!loaded || !window.Razorpay) {
      throw new Error("Failed to load Razorpay checkout")
    }

    const orderResponse = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: selectedPlan,
        email,
        name,
        phone,
      }),
    })

    const orderData = (await orderResponse.json()) as CreateOrderResponse & { error?: string }

    if (!orderResponse.ok || !orderData.orderId || !orderData.keyId) {
      throw new Error(orderData.error ?? "Unable to create Razorpay order")
    }

    const razorpay = new window.Razorpay({
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "GodSpeed",
      description: `${selectedPlanInfo.name} Membership`,
      order_id: orderData.orderId,
      prefill: {
        name,
        email,
      },
      handler: async (response: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
      }) => {
        const verifyResponse = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,
            planId: selectedPlan,
            name,
            email,
            phone,
          }),
        })

        const verifyData = (await verifyResponse.json()) as { verified: boolean; error?: string }

        if (!verifyResponse.ok || !verifyData.verified) {
          setStatus(verifyData.error ?? "Payment verification failed")
          return
        }

        setStatus("Razorpay payment verified. Membership is now active. Welcome message will be sent on WhatsApp.")
      },
      theme: {
        color: "#6d28d9",
      },
    })

    razorpay.open()
  }

  async function handleContinueFromDetails() {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setStatus("Name, email, and WhatsApp number are required")
      return
    }

    setStatus("")
    setBusy(true)

    try {
      if (paymentMethod === "stripe") {
        await prepareStripePayment()
      }
      setStep(3)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to continue")
    } finally {
      setBusy(false)
    }
  }

  async function handleRazorpayPay() {
    setBusy(true)
    setStatus("")

    try {
      await handleRazorpay()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to start Razorpay checkout")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="rounded-3xl border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {steps.map((label, index) => {
          const current = index + 1
          const active = current === step

          return (
            <div key={label} className="flex items-center gap-2">
              <span
                className={
                  active
                    ? "rounded-full border border-primary/70 bg-primary/15 px-2.5 py-1 text-foreground"
                    : "rounded-full border border-transparent px-2.5 py-1 text-muted-foreground"
                }
              >{`${current}. ${label}`}</span>
              {index < steps.length - 1 ? <span>•</span> : null}
            </div>
          )
        })}
      </div>

      {step === 1 ? (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <PricingCards selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />
          <button
            type="button"
            className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
            onClick={toNextStep}
          >
            Continue
          </button>
        </motion.div>
      ) : null}

      {step === 2 ? (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2"
              placeholder="John Appleseed"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2"
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">WhatsApp number</label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2"
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Payment method</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("stripe")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  paymentMethod === "stripe"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-foreground"
                }`}
              >
                Stripe
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("razorpay")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  paymentMethod === "razorpay"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-foreground"
                }`}
              >
                Razorpay
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold"
              onClick={toPreviousStep}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleContinueFromDetails}
              disabled={busy}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {busy ? "Preparing..." : "Continue to payment"}
            </button>
          </div>
        </motion.div>
      ) : null}

      {step === 3 ? (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-white/15 bg-background/60 p-4 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Selected plan</p>
            <p className="text-lg font-semibold">{selectedPlanInfo.name}</p>
          </div>

          {paymentMethod === "stripe" ? (
            stripePromise && clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeCheckoutForm
                  clientSecret={clientSecret}
                  email={email}
                  name={name}
                  onSuccess={(paymentId) => {
                    setStatus(
                      `Stripe payment ${paymentId} completed. Membership activation will be finalized by webhook and welcome message will be sent on WhatsApp.`,
                    )
                  }}
                />
              </Elements>
            ) : (
              <p className="text-sm text-muted-foreground">Stripe is unavailable. Check publishable key.</p>
            )
          ) : (
            <button
              type="button"
              onClick={handleRazorpayPay}
              disabled={busy}
              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {busy ? "Starting checkout..." : "Pay with Razorpay"}
            </button>
          )}

          <button
            type="button"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold"
            onClick={toPreviousStep}
          >
            Back
          </button>
        </motion.div>
      ) : null}

      {status ? <p className="mt-4 text-sm text-primary">{status}</p> : null}
    </section>
  )
}
