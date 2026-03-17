"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { lerp } from "@/lib/math"
import { scrollStore } from "@/store/scroll-store"

type SmoothScrollProviderProps = {
  children: React.ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
    })

    let rafId = 0
    let targetProgress = 0
    let visualProgress = 0

    const updateProgress = ({ scroll, limit }: { scroll: number; limit: number }) => {
      targetProgress = limit > 0 ? scroll / limit : 0
      ScrollTrigger.update()
    }

    lenis.on("scroll", updateProgress)

    const raf = (time: number) => {
      lenis.raf(time)
      visualProgress = lerp(visualProgress, targetProgress, 0.12)
      scrollStore.setProgress(visualProgress)
      rafId = window.requestAnimationFrame(raf)
    }

    rafId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(rafId)
      lenis.off("scroll", updateProgress)
      lenis.destroy()
      ScrollTrigger.killAll(false)
    }
  }, [])

  return <>{children}</>
}
