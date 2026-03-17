export type PlanId = "starter" | "pro" | "elite"

export type PlanDefinition = {
  id: PlanId
  name: string
  description: string
  stripeAmountUsdCents: number
  razorpayAmountInrPaise: number
  features: string[]
}

export const PLAN_DEFINITIONS: Record<PlanId, PlanDefinition> = {
  starter: {
    id: "starter",
    name: "Starter Cut",
    description: "Ideal for beginners building consistency and core strength.",
    stripeAmountUsdCents: 2900,
    razorpayAmountInrPaise: 199900,
    features: ["3-day split program", "Basic nutrition guide", "Community support"],
  },
  pro: {
    id: "pro",
    name: "Pro Build",
    description: "For members focused on muscle gain and body recomposition.",
    stripeAmountUsdCents: 7900,
    razorpayAmountInrPaise: 549900,
    features: ["5-day hypertrophy program", "Weekly coach check-ins", "Custom macro targets"],
  },
  elite: {
    id: "elite",
    name: "Elite Athlete",
    description: "For high-performers pursuing advanced physique and conditioning.",
    stripeAmountUsdCents: 14900,
    razorpayAmountInrPaise: 999900,
    features: ["Performance coaching", "Priority trainer access", "Advanced recovery protocol"],
  },
}

export function isPlanId(value: string): value is PlanId {
  return value === "starter" || value === "pro" || value === "elite"
}
