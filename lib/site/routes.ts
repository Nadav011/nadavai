// The 16 pages of the NadavAI site. The keys are the prototype's page names (index.html, work-sporchat.html ...),
// which the generated components and the ported JS modules still use; the values are the routes under /[locale].
export const PAGE_ROUTES = {
  index: "",
  services: "services",
  work: "work",
  "work-sporchat": "work/sporchat",
  "work-medizen": "work/medizen",
  "work-green-room": "work/green-room",
  "my-branch": "work/my-branch",
  "mexicani-network": "work/mexicani-network",
  social: "social",
  about: "about",
  plans: "plans",
  check: "check",
  play: "play",
  contact: "contact",
  accessibility: "accessibility",
  privacy: "privacy",
} as const

export type PageName = keyof typeof PAGE_ROUTES

export function pathFor(locale: string, page: string): string {
  const route = PAGE_ROUTES[page as PageName] ?? ""
  return route ? `/${locale}/${route}` : `/${locale}`
}

export function pageForSlug(slug: string[] | undefined): PageName | null {
  const route = (slug ?? []).join("/")
  const hit = Object.entries(PAGE_ROUTES).find(([, r]) => r === route)
  return hit ? (hit[0] as PageName) : null
}
