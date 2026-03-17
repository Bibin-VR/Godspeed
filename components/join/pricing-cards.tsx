"use client"

import { cn } from "@/lib/utils"
import { PLAN_DEFINITIONS, type PlanId } from "@/lib/plans"

type PricingCardsProps = {
  selectedPlan: PlanId
  onSelectPlan: (planId: PlanId) => void
}

const order: PlanId[] = ["starter", "pro", "elite"]

export function PricingCards({ selectedPlan, onSelectPlan }: PricingCardsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {order.map((planId) => {
        const plan = PLAN_DEFINITIONS[planId]
        const isSelected = selectedPlan === planId

        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => onSelectPlan(plan.id)}
            className={cn(
              "rounded-2xl border p-5 text-left transition-all",
              isSelected
                ? "border-primary/80 bg-primary/20 shadow-lg backdrop-blur-sm"
                : "border-white/15 bg-white/5 backdrop-blur-sm hover:border-primary/60",
            )}
          >
            <h3 className="text-2xl font-semibold">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
            <p className="mt-4 text-3xl font-bold">₹{(plan.upiAmountInrPaise / 100).toLocaleString("en-IN")}</p>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </button>
        )
      })}
    </div>
  )
}
