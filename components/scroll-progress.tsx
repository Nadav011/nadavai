"use client"

export function ScrollProgress() {
  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[2px]">
      <div className="scroll-progress-bar h-full bg-gradient-to-l from-[#06d6e0] to-[#e84393]" />
    </div>
  )
}
