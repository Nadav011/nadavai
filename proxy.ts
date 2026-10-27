import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  // every page path, so an address without a locale (/contact) is sent to its locale; not the API, Next's own files,
  // the ported prototype (/site) or any file with an extension
  matcher: ["/((?!api|_next|_vercel|site|.*\\..*).*)"],
}
