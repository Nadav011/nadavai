// @ts-nocheck
"use client"

import dynamic from "next/dynamic"

// Client component wrapper — dynamic with ssr:false is only valid in Client Components
const GSAPSetupInner = dynamic(
  () => import("@/components/gsap-setup").then(m => ({ default: m.GSAPSetup })),
  { ssr: false }
)

export function GSAPSetupLazy() {
  return <GSAPSetupInner />
}
