import Link from "next/link"
import { PRODUCTS } from "@/lib/products"

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.20),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.16),transparent_35%)] px-4 py-12 sm:px-6 md:px-10 md:py-16">
      <section className="mx-auto w-full max-w-6xl">
        <div className="mb-8 rounded-3xl border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">GodSpeed Store</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Explore supplements, gym accessories, and essentials curated for performance and recovery.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-xl backdrop-blur"
            >
              <img src={product.imageUrl} alt={product.name} className="h-52 w-full object-cover" loading="lazy" />
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {product.category}
                    </p>
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                  </div>
                  <span className="rounded-full border border-border px-3 py-1 text-sm font-semibold">
                    ₹{product.priceInr.toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">{product.description}</p>

                <ul className="space-y-1 text-sm text-muted-foreground">
                  {product.highlights.map((highlight) => (
                    <li key={highlight}>• {highlight}</li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-2">
                  <span
                    className={`text-xs font-semibold uppercase tracking-[0.12em] ${
                      product.inStock ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {product.inStock ? "In stock" : "Out of stock"}
                  </span>
                  <Link
                    href="/contact"
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                  >
                    Enquire
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
