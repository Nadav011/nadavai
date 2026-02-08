"use client"

import dynamic from "next/dynamic"

const Particles = dynamic(() => import("@/components/particles").then(mod => ({ default: mod.Particles })), { ssr: false })
const CustomCursor = dynamic(() => import("@/components/custom-cursor").then(mod => ({ default: mod.CustomCursor })), { ssr: false })
const WhatsAppButton = dynamic(() => import("@/components/whatsapp-button").then(mod => ({ default: mod.WhatsAppButton })), { ssr: false })
const EasterEgg = dynamic(() => import("@/components/easter-egg").then(mod => ({ default: mod.EasterEgg })), { ssr: false })
const AmbientOrbs = dynamic(() => import("@/components/ambient-orbs").then(mod => ({ default: mod.AmbientOrbs })), { ssr: false })

export function NonCritical() {
  return (
    <>
      <Particles />
      <AmbientOrbs />
      <CustomCursor />
      <WhatsAppButton />
      <EasterEgg />
    </>
  )
}
