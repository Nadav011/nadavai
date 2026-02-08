export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(222,47%,4%)]">
      <div className="relative">
        {/* Main spinner */}
        <div className="relative w-20 h-20">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[hsl(215,28%,16%)]" />

          {/* Animated gradient ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: '#06d6e0',
              borderRightColor: '#e84393',
              animationDuration: '1.2s',
            }}
          />

          {/* Inner pulsing circle */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#06d6e0]/20 to-[#e84393]/20 animate-pulse" />

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#06d6e0] to-[#e84393]" />
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#06d6e0]/10 rounded-full blur-xl animate-pulse" />
      </div>

      {/* Loading text */}
      <span className="sr-only">טוען...</span>
    </div>
  )
}
