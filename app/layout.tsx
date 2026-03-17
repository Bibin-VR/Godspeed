import type { Metadata } from "next"
import Link from "next/link"
import { INSTAGRAM_PROFILE } from "@/lib/instagram-content"
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
          <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
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
            <div className="flex flex-wrap items-center justify-end gap-2 text-xs sm:gap-4 sm:text-sm">
              <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                About
              </Link>
              <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
                Contact
              </Link>
              <Link href="/join" className="rounded-full bg-primary px-4 py-1.5 font-semibold text-primary-foreground">
                Join
              </Link>
              <a
                href={INSTAGRAM_PROFILE.url}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Instagram
              </a>
            </div>
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
