"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import { INSTAGRAM_PROFILE, TOP_LIKED_POSTS, TOP_VIEWED_VIDEOS } from "@/lib/instagram-content"

export default function HomePage() {
  const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
  const withBasePath = (url: string) => (url.startsWith("/") ? `${publicBasePath}${url}` : url)

  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-background px-4 py-8 sm:px-6 md:px-10 md:py-14">
        <section className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">GodSpeed Fitness</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Build raw strength. Sculpt peak conditioning.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
              {INSTAGRAM_PROFILE.bio}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/join"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Start Membership
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Explore Programs
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-2xl border border-border/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Image
              src={withBasePath("/images/hero-gym.jpg")}
              alt="GodSpeed Fitness athlete posing in gym"
              width={1200}
              height={1600}
              priority
              className="h-[48vh] min-h-[320px] w-full object-cover sm:h-[56vh] lg:h-[68vh]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-xl font-semibold text-white">Train hard. Recover smart. Progress every week.</p>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto mt-16 grid w-full max-w-6xl gap-4 sm:gap-6 md:mt-24 md:grid-cols-3">
          {[
            {
              title: "Strength & Hypertrophy",
              body: "Structured progressive overload blocks with data-backed volume and intensity control.",
            },
            {
              title: "Fat Loss & Conditioning",
              body: "High-efficiency metabolic circuits and conditioning programs tailored to your goal.",
            },
            {
              title: "Nutrition Coaching",
              body: "Macro planning, meal frameworks, and accountability check-ins for consistent results.",
            },
          ].map((panel, index) => (
            <motion.article
              key={panel.title}
              className="rounded-2xl border border-border bg-card p-6"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
            >
              <h2 className="text-lg font-semibold sm:text-xl">{panel.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{panel.body}</p>
            </motion.article>
          ))}
        </section>

        <section className="mx-auto mt-16 w-full max-w-6xl md:mt-24">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Most Viewed Videos</h2>
              <p className="mt-1 text-sm text-muted-foreground">Top performing reels from @godspeed_gym</p>
            </div>
            <a
              href={INSTAGRAM_PROFILE.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-primary"
            >
              View all
            </a>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOP_VIEWED_VIDEOS.map((item) => (
              <a
                key={item.shortcode}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden rounded-2xl border border-border bg-card transition-transform hover:scale-[1.01]"
              >
                <img
                  src={withBasePath(item.imageUrl)}
                  alt="Top viewed gym video"
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
                <div className="space-y-1 p-4 text-sm">
                  <p className="font-semibold">{item.views?.toLocaleString()} views</p>
                  <p className="text-muted-foreground">{item.likes.toLocaleString()} likes · {item.comments} comments</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 w-full max-w-6xl md:mt-24">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Top Liked Posts</h2>
            <p className="mt-1 text-sm text-muted-foreground">Popular transformation and training content</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOP_LIKED_POSTS.map((item) => (
              <a
                key={item.shortcode}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden rounded-2xl border border-border bg-card transition-transform hover:scale-[1.01]"
              >
                <img
                  src={withBasePath(item.imageUrl)}
                  alt="Top liked gym post"
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
                <div className="space-y-1 p-4 text-sm">
                  <p className="font-semibold">{item.likes.toLocaleString()} likes</p>
                  <p className="text-muted-foreground">{item.comments} comments</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <motion.section
          className="mx-auto mt-16 max-w-6xl rounded-3xl border border-border bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-emerald-500/10 p-6 text-center sm:p-8 md:mt-24 md:p-10"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready for your transformation?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Join GodSpeed Fitness and get access to elite coaching, programming, and a disciplined training community.
          </p>
          <Link
            href="/join"
            className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Join the Gym
          </Link>
        </motion.section>
      </main>
    </SmoothScrollProvider>
  )
}
