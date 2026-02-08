'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service (e.g., Sentry)
    console.error('Global Error:', error)
  }, [error])

  return (
    <html lang="he" dir="rtl">
      <body className="bg-[hsl(222,47%,4%)] text-[hsl(210,40%,98%)] font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-[#e84393]/20 rounded-full blur-xl animate-pulse" />
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#e84393] to-[#ff5f56] p-[2px]">
                <div className="flex items-center justify-center w-full h-full rounded-full bg-[hsl(222,47%,4%)]">
                  <AlertTriangle className="w-10 h-10 text-[#e84393]" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl md:text-4xl font-bold mb-3">משהו השתבש</h1>
            <p className="text-base text-[hsl(215,20%,55%)] mb-8 leading-relaxed">
              אופס! קרתה שגיאה בלתי צפויה. נא לנסות שוב.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && error.message && (
              <div className="mb-8 p-4 rounded-lg bg-[hsl(222,47%,6%)] border border-[hsl(215,28%,16%)] text-start">
                <p className="text-xs font-mono text-[#e84393] break-words">{error.message}</p>
                {error.digest && (
                  <p className="text-[10px] font-mono text-[hsl(215,20%,45%)] mt-2">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action */}
            <button
              onClick={reset}
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-[hsl(222,47%,4%)] bg-gradient-to-l from-[#06d6e0] to-[#0abfca] hover:shadow-[0_0_30px_hsl(187,92%,55%,0.4)] transition-all duration-500"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" aria-hidden="true" />
              נסה שוב
            </button>

            {/* Footer hint */}
            <p className="mt-8 text-xs font-mono text-[hsl(215,20%,45%)]">
              אם הבעיה נמשכת, צור קשר דרך WhatsApp
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
