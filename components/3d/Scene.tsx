"use client"

import { useSyncExternalStore } from "react"
import { Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type { Mesh } from "three"
import { useMemo, useRef, useState } from "react"
import { lerp } from "@/lib/math"
import { scrollStore } from "@/store/scroll-store"

function useScrollProgress() {
  return useSyncExternalStore(
    scrollStore.subscribe,
    () => scrollStore.getState().progress,
    () => 0,
  )
}

function PlaceholderBox() {
  const meshRef = useRef<Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)
  const targetScale = useRef(1)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.3
    meshRef.current.rotation.y += delta * 0.48
    const nextScale = lerp(meshRef.current.scale.x, targetScale.current, 0.1)
    meshRef.current.scale.set(nextScale, nextScale, nextScale)
  })

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={() => {
        setIsHovered(true)
        targetScale.current = 1.14
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        setIsHovered(false)
        targetScale.current = 1
        document.body.style.cursor = "default"
      }}
    >
      <boxGeometry args={[1.8, 1.8, 1.8]} />
      <meshStandardMaterial
        color={isHovered ? "#c4b5fd" : "#9b87f5"}
        roughness={0.35}
        metalness={0.45}
      />
    </mesh>
  )
}

function FloatingPanel({
  position,
  tint,
  speed,
}: {
  position: [number, number, number]
  tint: string
  speed: number
}) {
  const panelRef = useRef<Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)
  const originY = useMemo(() => position[1], [position])

  useFrame((state) => {
    if (!panelRef.current) return
    panelRef.current.position.y = originY + Math.sin(state.clock.elapsedTime * speed) * 0.2
    panelRef.current.rotation.y += 0.004

    const target = isHovered ? 1.1 : 1
    const next = lerp(panelRef.current.scale.x, target, 0.12)
    panelRef.current.scale.set(next, next, next)
  })

  return (
    <mesh
      ref={panelRef}
      position={position}
      onPointerOver={() => {
        setIsHovered(true)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        setIsHovered(false)
        document.body.style.cursor = "default"
      }}
    >
      <planeGeometry args={[1.4, 0.9]} />
      <meshStandardMaterial color={tint} roughness={0.45} metalness={0.2} />
    </mesh>
  )
}

function CameraRig() {
  const progress = useScrollProgress()

  useFrame((state) => {
    const x = lerp(state.camera.position.x, -1.4 + progress * 2.2, 0.08)
    const y = lerp(state.camera.position.y, 0.5 - progress * 0.9, 0.08)
    const z = lerp(state.camera.position.z, 5 - progress * 1.8, 0.08)

    state.camera.position.set(x, y, z)
    state.camera.lookAt(0, 0, 0)
  })

  return null
}

function SceneContent() {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, -2, 2]} intensity={0.65} color="#8ec5ff" />

      <PlaceholderBox />
      <FloatingPanel position={[-2.5, 1.2, -0.3]} tint="#67e8f9" speed={1.5} />
      <FloatingPanel position={[2.3, 1.4, -0.2]} tint="#f9a8d4" speed={1.35} />
      <FloatingPanel position={[2.1, -1.25, 0.4]} tint="#86efac" speed={1.8} />

      <mesh position={[0, -2.2, -0.8]}>
        <planeGeometry args={[4.8, 0.65]} />
        <meshStandardMaterial color="#fde68a" emissive="#ca8a04" emissiveIntensity={0.18} />
      </mesh>
    </>
  )
}

export function Scene() {
  return (
    <div className="relative h-[60vh] w-full min-h-[420px] overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-xl border border-white/15 bg-black/45 px-4 py-3 text-center text-sm font-medium tracking-wide text-white backdrop-blur">
        Join GodSpeed
      </div>
    </div>
  )
}
