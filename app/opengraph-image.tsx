import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "NADAV.AI - Full-Stack AI Developer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #070714 0%, #0a0a1a 50%, #0d0d20 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(6,214,224,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,214,224,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow effects */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: 200,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,214,224,0.15), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: 200,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,67,147,0.12), transparent 70%)",
          }}
        />

        {/* Logo icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #06d6e0, #e84393)",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 74,
              height: 74,
              borderRadius: 17,
              background: "#070714",
              fontSize: 36,
              color: "#06d6e0",
            }}
          >
            ⚡
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 72, fontWeight: 800, color: "#e8e8ed", letterSpacing: -2 }}>
            NADAV
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: -2,
              background: "linear-gradient(135deg, #06d6e0, #e84393)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            .AI
          </span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 28, color: "#8b8b9e", marginBottom: 40, fontWeight: 500 }}>
          Full-Stack AI Developer
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 48 }}>
          {[
            { value: "8+", label: "Production Apps" },
            { value: "80", label: "AI Skills" },
            { value: "38+", label: "AI Agents" },
          ].map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: "#06d6e0" }}>{stat.value}</span>
              <span style={{ fontSize: 14, color: "#8b8b9e", letterSpacing: 1, textTransform: "uppercase" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#4a4a5e",
            fontSize: 16,
          }}
        >
          <span style={{ fontFamily: "monospace" }}>nadavc.ai</span>
          <span>•</span>
          <span>Everything with AI</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
