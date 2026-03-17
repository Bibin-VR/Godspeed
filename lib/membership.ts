import type { PlanTier } from "@prisma/client"
import type { PlanId } from "@/lib/plans"

export function toPlanTier(planId: PlanId): PlanTier {
  if (planId === "starter") return "STARTER"
  if (planId === "pro") return "PRO"
  return "ELITE"
}
