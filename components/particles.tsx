"use client"

export function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
      {/* 3D Perspective Grid Floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[60vh] opacity-[0.07]"
        style={{
          background:
            "linear-gradient(transparent 65%, hsl(187 92% 55% / 0.4))",
          maskImage: "linear-gradient(to bottom, transparent, black 40%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 40%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(hsl(187 92% 55% / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(187 92% 55% / 0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(60deg)",
            transformOrigin: "center top",
          }}
        />
      </div>

      {/* Floating depth orbs - GPU composited with will-change */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, hsl(187 92% 55% / 0.06), transparent 70%)",
          top: "10%",
          left: "15%",
          willChange: "opacity, filter",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, hsl(330 85% 60% / 0.05), transparent 70%)",
          top: "50%",
          right: "10%",
          animationDelay: "2s",
          willChange: "opacity, filter",
        }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full blur-[90px] animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, hsl(240 70% 60% / 0.04), transparent 70%)",
          bottom: "20%",
          left: "40%",
          animationDelay: "4s",
          willChange: "opacity, filter",
        }}
      />

      {/* Subtle vertical light rays */}
      <div
        className="absolute top-0 h-full w-[1px] opacity-[0.04]"
        style={{
          left: "20%",
          background: "linear-gradient(to bottom, transparent, hsl(187 92% 55%), transparent)",
        }}
      />
      <div
        className="absolute top-0 h-full w-[1px] opacity-[0.03]"
        style={{
          left: "80%",
          background: "linear-gradient(to bottom, transparent 30%, hsl(330 85% 60%), transparent 70%)",
        }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-bg" />
    </div>
  )
}
