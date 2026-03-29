export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep">
      <div className="relative">
        {/* Main spinner */}
        <div className="relative w-20 h-20">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-border" />

          {/* Animated gradient ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "oklch(0.81 0.17 193)",
              borderRightColor: "oklch(0.65 0.25 350)",
              animationDuration: "1.2s",
            }}
          />

          {/* Inner shimmer circle */}
          <div
            className="absolute inset-3 rounded-full animate-pulse"
            style={{
              background:
                "radial-gradient(circle, oklch(0.81 0.17 193 / 0.2), oklch(0.65 0.25 350 / 0.15), transparent)",
            }}
          />

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: "linear-gradient(135deg, oklch(0.81 0.17 193), oklch(0.65 0.25 350))",
              }}
            />
          </div>
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-xl animate-pulse"
          style={{ background: "oklch(0.81 0.17 193 / 0.1)" }}
        />
      </div>

      {/* Shimmer skeleton preview */}
      <div className="absolute inset-x-0 top-0 pointer-events-none" aria-hidden="true">
        {/* Navbar skeleton */}
        <div className="h-16 border-b border-border-subtle glass" />

        {/* Content skeleton lines */}
        <div className="max-w-4xl mx-auto px-4 pt-32 space-y-6">
          <div
            className="h-4 w-48 rounded-full animate-shimmer"
            style={{
              background: "linear-gradient(90deg, oklch(0.16 0.025 243), oklch(0.22 0.02 260), oklch(0.16 0.025 243))",
              backgroundSize: "200% 100%",
            }}
          />
          <div
            className="h-10 w-3/4 rounded-lg animate-shimmer"
            style={{
              background: "linear-gradient(90deg, oklch(0.16 0.025 243), oklch(0.22 0.02 260), oklch(0.16 0.025 243))",
              backgroundSize: "200% 100%",
              animationDelay: "0.1s",
            }}
          />
          <div
            className="h-10 w-1/2 rounded-lg animate-shimmer"
            style={{
              background: "linear-gradient(90deg, oklch(0.16 0.025 243), oklch(0.22 0.02 260), oklch(0.16 0.025 243))",
              backgroundSize: "200% 100%",
              animationDelay: "0.2s",
            }}
          />
          <div className="h-6" />
          <div
            className="h-4 w-2/3 rounded-full animate-shimmer"
            style={{
              background: "linear-gradient(90deg, oklch(0.16 0.025 243), oklch(0.22 0.02 260), oklch(0.16 0.025 243))",
              backgroundSize: "200% 100%",
              animationDelay: "0.3s",
            }}
          />
        </div>
      </div>

      {/* Loading text */}
      <span className="sr-only">Loading...</span>
    </div>
  )
}
