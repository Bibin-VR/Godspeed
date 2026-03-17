import type { Metadata } from "next"
import Link from "next/link"
import { INSTAGRAM_PROFILE } from "@/lib/instagram-content"
import { SiteNavLinks } from "@/components/site-nav-links"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "GodSpeed Fitness",
  description: "Elite fitness training, transformation programs, and premium gym memberships.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919000000000"
  const whatsappText = encodeURIComponent("Hi GodSpeed Fitness, I want to know more about your programs.")

  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
          <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
            <Link href="/" className="text-base font-bold tracking-tight sm:text-lg">
              <span className="flex items-center gap-2">
                <img
                  src={`${publicBasePath}${INSTAGRAM_PROFILE.profileImageUrl}`}
                  alt="GodSpeed Gym logo"
                  className="h-7 w-7 rounded-full border border-white/20 object-cover sm:h-8 sm:w-8"
                />
                <span>GodSpeed Fitness</span>
              </span>
            </Link>

            <div className="hidden items-center justify-end gap-4 text-sm md:flex">
              <SiteNavLinks />
              <a
                href={INSTAGRAM_PROFILE.url}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Instagram
              </a>
            </div>

            <details className="relative md:hidden">
              <summary className="flex h-10 w-10 cursor-pointer list-none flex-col items-center justify-center gap-1 rounded-md border border-border/70 bg-background/70 text-foreground marker:content-none">
                <span className="sr-only">Open menu</span>
                <span className="block h-0.5 w-5 rounded bg-current" />
                <span className="block h-0.5 w-5 rounded bg-current" />
                <span className="block h-0.5 w-5 rounded bg-current" />
              </summary>

              <div className="absolute right-0 top-12 z-50 min-w-44 rounded-xl border border-border bg-card p-2 shadow-xl">
                <SiteNavLinks mobile />
                <a
                  href={INSTAGRAM_PROFILE.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Instagram
                </a>
              </div>
            </details>
          </nav>
        </header>
        {children}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
        >
          Connect on WhatsApp
        </a>
      </body>
    </html>
  )
}
