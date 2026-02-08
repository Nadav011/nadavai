'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Link } from '@/i18n/routing'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')

  useEffect(() => {
    // Log error to monitoring service (e.g., Sentry)
    console.error('Page Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[hsl(222,47%,4%)]">
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
        <h1 className="text-3xl md:text-4xl font-bold text-[hsl(210,40%,98%)] mb-3">
          {t('title')}
        </h1>
        <p className="text-base text-[hsl(215,20%,55%)] mb-8 leading-relaxed">
          {t('description')}
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

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-[hsl(222,47%,4%)] bg-gradient-to-l from-[#06d6e0] to-[#0abfca] hover:shadow-[0_0_30px_hsl(187,92%,55%,0.4)] transition-all duration-500"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" aria-hidden="true" />
            {t('retry')}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-medium text-[hsl(210,40%,98%)] border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,7%)] hover:border-[#06d6e0]/40 transition-all duration-500"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            {t('home')}
          </Link>
        </div>

        {/* Footer hint */}
        <p className="mt-8 text-xs font-mono text-[hsl(215,20%,45%)]">
          {t('hint')}
        </p>
      </div>
    </div>
  )
}
