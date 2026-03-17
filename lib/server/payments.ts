import "server-only"
import Razorpay from "razorpay"
import Stripe from "stripe"

let stripeInstance: Stripe | null = null
let razorpayInstance: Razorpay | null = null

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance

  const stripeSecret = process.env.STRIPE_SECRET_KEY
  if (!stripeSecret) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable")
  }

  stripeInstance = new Stripe(stripeSecret, {
    typescript: true,
  })

  return stripeInstance
}

export function getRazorpay(): Razorpay {
  if (razorpayInstance) return razorpayInstance

  const razorpayKeyId = process.env.RAZORPAY_KEY_ID
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error("Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET environment variable")
  }

  razorpayInstance = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  })

  return razorpayInstance
}
