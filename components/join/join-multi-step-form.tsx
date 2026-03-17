"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { PLAN_DEFINITIONS, type PlanId } from "@/lib/plans"
import { PricingCards } from "@/components/join/pricing-cards"

type VerifyUpiResponse = {
  verified: boolean
  error?: string
}

const steps = ["Plan", "Details", "Payment"] as const

export function JoinMultiStepForm() {
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("starter")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [utr, setUtr] = useState("")
  const [status, setStatus] = useState<string>("")
  const [busy, setBusy] = useState(false)

  const selectedPlanInfo = useMemo(() => PLAN_DEFINITIONS[selectedPlan], [selectedPlan])
  const amountInr = selectedPlanInfo.upiAmountInrPaise / 100
  const upiId = process.env.NEXT_PUBLIC_UPI_ID ?? "godspeed@upi"
  const upiName = process.env.NEXT_PUBLIC_UPI_NAME ?? "GodSpeed Fitness"
  const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true"
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919000000000"

  function toNextStep() {
    if (step < 3) setStep((prev) => prev + 1)
  }

  function toPreviousStep() {
    if (step > 1) setStep((prev) => prev - 1)
  }

  function createUpiPaymentLink() {
    const params = new URLSearchParams({
      pa: upiId,
      pn: upiName,
      am: amountInr.toFixed(2),
      cu: "INR",
      tn: `${selectedPlanInfo.name} Membership`,
    })

    return `upi://pay?${params.toString()}`
  }

  async function handleContinueFromDetails() {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setStatus("Name, email, and WhatsApp number are required")
      return
    }

    setStatus("")
    setBusy(true)

    try {
      setStep(3)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to continue")
    } finally {
      setBusy(false)
    }
  }

  async function handleUpiPay() {
    const upiLink = createUpiPaymentLink()

    if (typeof window !== "undefined") {
      window.location.href = upiLink
    }

    setStatus("UPI payment app opened. Complete payment, then submit your UTR below.")
  }

  async function handleSubmitUtr() {
    if (!utr.trim()) {
      setStatus("Please enter your UTR / transaction reference")
      return
    }

    setBusy(true)

    try {
      if (isStaticExport) {
        const text = encodeURIComponent(
          `Membership UPI payment submitted\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPlan: ${selectedPlanInfo.name}\nAmount: ₹${amountInr.toLocaleString("en-IN")}\nUTR: ${utr.trim()}`,
        )
        window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank", "noopener,noreferrer")
        setStatus("UTR shared on WhatsApp. Team will verify and activate your membership.")
        return
      }

      const verifyResponse = await fetch("/api/upi/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          name,
          email,
          phone,
          utr,
        }),
      })

      const verifyData = (await verifyResponse.json()) as VerifyUpiResponse

      if (!verifyResponse.ok || !verifyData.verified) {
        setStatus(verifyData.error ?? "UPI verification failed")
        return
      }

      setStatus("UPI payment received. Membership is now active. Welcome message will be sent on WhatsApp.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to submit UPI reference")
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

          <div className="rounded-xl border border-white/15 bg-background/60 p-4 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Payment mode</p>
            <p className="text-base font-semibold">UPI</p>
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
            <p className="mt-1 text-sm text-muted-foreground">Amount: ₹{amountInr.toLocaleString("en-IN")}</p>
          </div>

          <div className="rounded-xl border border-white/15 bg-background/60 p-4 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">UPI ID</p>
            <p className="text-base font-semibold">{upiId}</p>
          </div>

          <button
            type="button"
            onClick={handleUpiPay}
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Open UPI App
          </button>

          <div>
            <label className="mb-1 block text-sm font-medium">UTR / Transaction reference</label>
            <input
              value={utr}
              onChange={(event) => setUtr(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2"
              placeholder="e.g. 409837654321"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmitUtr}
            disabled={busy}
            className="w-full rounded-full border border-border px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {busy ? "Verifying..." : isStaticExport ? "Submit UTR on WhatsApp" : "Submit UTR & Activate Membership"}
          </button>

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
