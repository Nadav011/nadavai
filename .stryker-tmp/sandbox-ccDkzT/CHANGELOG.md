## [unreleased]

### 🚀 Features

- Implement NADAVAI portfolio site with all sections
- *(ui)* Add Aceternity UI components for enhanced visual effects
- *(sections)* Integrate Aceternity UI components into sections
- *(i18n)* Move all hardcoded content to translation files (he/en)
- Replace old portfolio with v0 redesign
- Add premium interactive features and scroll variety
- Update portfolio with real data from full system scan
- Add APEX Engine to projects, expand AI models in marquee
- Add 3D wireframe globe hero effect, comprehensive SEO, sitemap & robots
- RTL compliance, accessibility, Heebo font, hero 3D globe rewrite
- Add OG image, ThemeProvider, newsletter signup
- Add Calendly booking, newsletter API, remove unused GSAP
- Replace canvas particles with CSS-only 3D background
- Add full i18n with next-intl (Hebrew + English)
- Replace CSS background with WebGL2 shader, disable zoom & text selection
- GSAP animations, WCAG AA contrast, perf & a11y improvements
- SEO structured data, dynamic imports, i18n completeness, a11y + error pages

### 🐛 Bug Fixes

- *(a11y)* Enforce 44px touch targets and remove unused types
- *(layout)* Move html/body to root layout for Next.js 16 compliance
- *(routing)* Add root page redirect and update domain to nadavc.ai
- Add vercel.json with legacy-peer-deps install command
- Update WhatsApp number and social links with real values
- *(i18n)* Add missing news titles and escape angle brackets in translations
- A11y aria-labels, aria-pressed on filters, remove unused React imports
- Isolate NonCritical SSR bailout with Suspense boundary
- Remove broken GitHub links, add working demo URLs
- Add comprehensive security headers to next.config.ts
- Exclude supabase/functions from TypeScript compilation (Deno jsr: incompatible)

### ⚡ Performance

- Convert page to Server Component, inline dark styles to eliminate white flash
- *(nadavai)* Remove motion/react from critical path via pure CSS TextGenerate
- Lazy GSAP+ScrollTrigger+HeroGlobe: 1052→400KB initial load
- Defer GSAP+cmdk from critical parse path, reduce total bundle 1064→1037KB

### ⚙️ Miscellaneous Tasks

- *(seo)* Expand Hebrew keywords and add project images directory
- Massive cleanup - remove 43 unused UI components, fix all lint errors
- Add CI pipeline via ci-standards reusable workflows
- Add bundle size guard — fail PR if bundle exceeds limit
