import { JoinMultiStepForm } from "@/components/join/join-multi-step-form"

export default function JoinPage() {
  return (
    <main className="min-h-screen px-6 py-16 md:px-10">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Join GodSpeed Fitness</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Choose your training membership and complete secure payment with Stripe or Razorpay.
        </p>

        <div className="mt-8">
          <JoinMultiStepForm />
        </div>
      </section>
    </main>
  )
}
