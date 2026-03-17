"use client"

import { FormEvent, useState } from "react"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"

type StripeCheckoutFormProps = {
  clientSecret: string
  email: string
  name: string
  onSuccess: (paymentId: string) => void
}

export function StripeCheckoutForm({ clientSecret, email, name, onSuccess }: StripeCheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    setError(null)

    const card = elements.getElement(CardElement)
    if (!card) {
      setError("Card input is unavailable")
      setIsProcessing(false)
      return
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          email,
          name,
        },
      },
    })

    if (result.error) {
      setError(result.error.message ?? "Payment failed")
      setIsProcessing(false)
      return
    }

    if (result.paymentIntent?.status === "succeeded") {
      onSuccess(result.paymentIntent.id)
      setIsProcessing(false)
      return
    }

    setError("Payment not completed")
    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-border bg-background p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#e4e4e7",
                "::placeholder": { color: "#a1a1aa" },
              },
            },
          }}
        />
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Pay with Stripe"}
      </button>
    </form>
  )
}
