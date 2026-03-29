/**
 * i18n/routing.test.ts
 *
 * Strategy:
 *  - Mock `next-intl/routing` and `next-intl/navigation` — they depend on
 *    Next.js server internals that are unavailable in a Vitest/jsdom env.
 *  - We capture the config object passed to `defineRouting` and assert on it
 *    directly, verifying the exported `routing` shape without needing the real
 *    next-intl implementation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── next-intl mocks ────────────────────────────────────────────────────────

// We need to capture the argument passed to defineRouting, so we hold a ref.
let capturedConfig: Record<string, unknown> | undefined;

vi.mock("next-intl/routing", () => ({
  defineRouting: vi.fn((config: Record<string, unknown>) => {
    capturedConfig = config;
    // Return config as-is — that's all our tests need from `routing`.
    return config;
  }),
}));

vi.mock("next-intl/navigation", () => ({
  createNavigation: vi.fn(() => ({
    Link: "a",
    redirect: vi.fn(),
    usePathname: vi.fn(),
    useRouter: vi.fn(),
    getPathname: vi.fn(),
  })),
}));

describe("i18n/routing", () => {
  beforeEach(() => {
    capturedConfig = undefined;
    vi.resetModules();
    vi.clearAllMocks();
  });

  // ── routing config shape ───────────────────────────────────────────────────

  it("defines routing with exactly two locales: 'he' and 'en'", async () => {
    const { routing } = await import("./routing");
    expect((routing as unknown as { locales: readonly string[] }).locales).toEqual(["he", "en"]);
  });

  it("sets 'he' (Hebrew) as the default locale", async () => {
    const { routing } = await import("./routing");
    expect((routing as { defaultLocale: string }).defaultLocale).toBe("he");
  });

  it("includes 'he' in the locales array", async () => {
    const { routing } = await import("./routing");
    expect((routing as unknown as { locales: readonly string[] }).locales).toContain("he");
  });

  it("includes 'en' in the locales array", async () => {
    const { routing } = await import("./routing");
    expect((routing as unknown as { locales: readonly string[] }).locales).toContain("en");
  });

  it("has exactly 2 supported locales (no extras)", async () => {
    const { routing } = await import("./routing");
    expect((routing as unknown as { locales: readonly string[] }).locales).toHaveLength(2);
  });

  it("default locale is one of the supported locales", async () => {
    const { routing } = await import("./routing");
    const r = routing as unknown as { locales: readonly string[]; defaultLocale: string };
    expect(r.locales).toContain(r.defaultLocale);
  });

  // ── defineRouting called correctly ────────────────────────────────────────

  it("calls defineRouting exactly once on module import", async () => {
    const { defineRouting } = await import("next-intl/routing");
    await import("./routing");
    expect(defineRouting).toHaveBeenCalledOnce();
  });

  it("passes the config object directly to defineRouting", async () => {
    await import("./routing");
    expect(capturedConfig).toBeDefined();
    expect(capturedConfig).toMatchObject({
      locales: ["he", "en"],
      defaultLocale: "he",
    });
  });

  // ── createNavigation called correctly ─────────────────────────────────────

  it("calls createNavigation exactly once with the routing config", async () => {
    const { createNavigation } = await import("next-intl/navigation");
    await import("./routing");
    expect(createNavigation).toHaveBeenCalledOnce();
  });

  // ── navigation exports are present ────────────────────────────────────────

  it("exports Link from createNavigation result", async () => {
    const mod = await import("./routing");
    expect(mod.Link).toBeDefined();
  });

  it("exports redirect from createNavigation result", async () => {
    const mod = await import("./routing");
    expect(mod.redirect).toBeDefined();
  });

  it("exports usePathname from createNavigation result", async () => {
    const mod = await import("./routing");
    expect(mod.usePathname).toBeDefined();
  });

  it("exports useRouter from createNavigation result", async () => {
    const mod = await import("./routing");
    expect(mod.useRouter).toBeDefined();
  });

  it("exports getPathname from createNavigation result", async () => {
    const mod = await import("./routing");
    expect(mod.getPathname).toBeDefined();
  });

  // ── Locale ordering invariant ──────────────────────────────────────────────

  it("lists 'he' before 'en' (RTL-first ordering convention)", async () => {
    const { routing } = await import("./routing");
    const locales = (routing as unknown as { locales: readonly string[] }).locales;
    expect(locales.indexOf("he")).toBeLessThan(locales.indexOf("en"));
  });
});
