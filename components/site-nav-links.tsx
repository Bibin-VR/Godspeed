"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type SiteNavLinksProps = {
  mobile?: boolean
}

export function SiteNavLinks({ mobile = false }: SiteNavLinksProps) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const getLinkClass = (href: string) => {
    if (mobile) {
      return cn(
        "block rounded-lg px-3 py-2 text-sm transition-colors",
        isActive(href)
          ? "border border-primary/60 bg-primary/15 font-semibold text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )
    }

    return cn(
      "border-b-2 border-transparent pb-1 transition-colors",
      isActive(href) ? "border-primary text-foreground" : "text-muted-foreground hover:text-foreground",
    )
  }

  const getJoinClass = () => {
    if (mobile) {
      return cn(
        "mt-1 block rounded-lg px-3 py-2 text-sm font-semibold",
        isActive("/join")
          ? "border border-primary/70 bg-primary/20 text-foreground"
          : "bg-primary text-primary-foreground",
      )
    }

    return cn(
      "rounded-full px-4 py-1.5 font-semibold",
      isActive("/join") ? "border border-primary bg-primary/20 text-foreground" : "bg-primary text-primary-foreground",
    )
  }

  return (
    <>
      <Link href="/about" className={getLinkClass("/about")}>
        About
      </Link>
      <Link href="/contact" className={getLinkClass("/contact")}>
        Contact
      </Link>
      <Link href="/join" className={getJoinClass()}>
        Join
      </Link>
    </>
  )
}
