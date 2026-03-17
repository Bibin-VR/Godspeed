import { JoinMultiStepForm } from "@/components/join/join-multi-step-form"

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.20),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.16),transparent_35%)] px-4 py-12 sm:px-6 md:px-10 md:py-16">
      <section className="mx-auto max-w-5xl rounded-3xl border border-white/15 bg-white/5 p-5 shadow-2xl backdrop-blur-xl md:p-8">
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
