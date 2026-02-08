import { useTranslations } from 'next-intl'
import { Search, Home, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[hsl(222,47%,4%)]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-[#06d6e0]/5 rounded-full blur-[150px] animate-pulse-glow" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
      </div>

      <div className="relative max-w-2xl w-full text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <span className="text-8xl md:text-9xl font-bold text-[hsl(210,40%,98%)] tracking-tight">4</span>
            <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
              <div className="absolute inset-0 bg-[#06d6e0]/20 rounded-full blur-xl animate-pulse" />
              <div className="relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-[#06d6e0] to-[#4f46e5] p-[2px]">
                <div className="flex items-center justify-center w-full h-full rounded-full bg-[hsl(222,47%,4%)]">
                  <Search className="w-10 h-10 md:w-12 md:h-12 text-[#06d6e0]" aria-hidden="true" />
                </div>
              </div>
            </div>
            <span className="text-8xl md:text-9xl font-bold text-[hsl(210,40%,98%)] tracking-tight">4</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-5xl font-bold text-[hsl(210,40%,98%)] mb-4">
          {t('title')}
        </h1>
        <p className="text-base md:text-lg text-[hsl(215,20%,55%)] mb-10 leading-relaxed max-w-md mx-auto">
          {t('description')}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-[hsl(222,47%,4%)] bg-gradient-to-l from-[#06d6e0] to-[#0abfca] hover:shadow-[0_0_40px_hsl(187,92%,55%,0.4)] transition-all duration-500"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            {t('home')}
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-medium text-[hsl(210,40%,98%)] border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,7%)] hover:border-[#e84393]/40 transition-all duration-500"
          >
            {t('contact')}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 p-6 rounded-xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)]">
          <h2 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-3">
            {t('suggestionsTitle')}
          </h2>
          <nav aria-label={t('suggestionsTitle')}>
            <ul className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <li>
                <Link href="/#projects" className="text-[#06d6e0] hover:underline">
                  {t('projects')}
                </Link>
              </li>
              <li>
                <span className="text-[hsl(215,20%,35%)]">•</span>
              </li>
              <li>
                <Link href="/#services" className="text-[#06d6e0] hover:underline">
                  {t('services')}
                </Link>
              </li>
              <li>
                <span className="text-[hsl(215,20%,35%)]">•</span>
              </li>
              <li>
                <Link href="/#blog" className="text-[#06d6e0] hover:underline">
                  {t('blog')}
                </Link>
              </li>
              <li>
                <span className="text-[hsl(215,20%,35%)]">•</span>
              </li>
              <li>
                <Link href="/#guides" className="text-[#06d6e0] hover:underline">
                  {t('guides')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
