import { describe, it, expect } from "vitest";
import { fc, test as fcTest } from "@fast-check/vitest";
import { cn } from "./utils";

describe("cn()", () => {
  // ── Happy path ─────────────────────────────────────────────────────────────

  it("returns a single class unchanged", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("joins multiple classes with a space", () => {
    expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
  });

  it("returns an empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  // ── Falsy filtering (clsx behaviour) ──────────────────────────────────────

  it("ignores undefined values", () => {
    expect(cn("foo", undefined, "bar")).toBe("foo bar");
  });

  it("ignores null values", () => {
    expect(cn("foo", null, "bar")).toBe("foo bar");
  });

  it("ignores false values", () => {
    expect(cn("foo", false, "bar")).toBe("foo bar");
  });

  it("ignores empty strings", () => {
    expect(cn("", "foo", "")).toBe("foo");
  });

  // ── Object syntax ──────────────────────────────────────────────────────────

  it("includes keys whose value is truthy", () => {
    expect(cn({ active: true, disabled: false })).toBe("active");
  });

  it("excludes keys whose value is falsy", () => {
    expect(cn({ hidden: false, visible: true })).toBe("visible");
  });

  it("handles mixed object and string inputs", () => {
    expect(cn("base", { active: true, inactive: false })).toBe("base active");
  });

  // ── Array syntax ───────────────────────────────────────────────────────────

  it("flattens arrays of class names", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("handles nested arrays with conditionals", () => {
    expect(cn(["foo", false && "bar", "baz"])).toBe("foo baz");
  });

  // ── Tailwind deduplication (twMerge behaviour) ─────────────────────────────

  it("resolves conflicting Tailwind padding utilities — last wins", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
  });

  it("resolves conflicting text colours — last wins", () => {
    expect(cn("text-red-500", "text-blue-600")).toBe("text-blue-600");
  });

  it("resolves conflicting background colours — last wins", () => {
    expect(cn("bg-red-500", "bg-green-400")).toBe("bg-green-400");
  });

  it("keeps non-conflicting Tailwind utilities side by side", () => {
    const result = cn("p-4", "m-2");
    expect(result).toContain("p-4");
    expect(result).toContain("m-2");
  });

  it("deduplicates identical classes", () => {
    // twMerge collapses same-group duplicates
    expect(cn("flex", "flex")).toBe("flex");
  });

  it("merges conditional class via object over a static base", () => {
    const isActive = true;
    expect(cn("btn", { "btn-active": isActive })).toBe("btn btn-active");
  });

  it("does not include conditional class when flag is false", () => {
    const isActive = false;
    expect(cn("btn", { "btn-active": isActive })).toBe("btn");
  });

  // ── RTL logical-property classes (no conflict — must preserve both) ────────

  it("preserves both ms- and me- logical margin utilities", () => {
    const result = cn("ms-2", "me-4");
    expect(result).toContain("ms-2");
    expect(result).toContain("me-4");
  });

  it("resolves conflicting ms- utilities — last wins", () => {
    expect(cn("ms-2", "ms-6")).toBe("ms-6");
  });

  // ── Property-based: output is always a string ──────────────────────────────

  fcTest.prop([fc.array(fc.oneof(fc.string(), fc.constant(undefined), fc.constant(null), fc.boolean()))])(
    "always returns a string regardless of input",
    (args) => {
      const result = cn(...(args as Parameters<typeof cn>));
      expect(typeof result).toBe("string");
    }
  );

  // ── Type-narrowing edge cases ──────────────────────────────────────────────

  it("handles numeric-looking class fragments passed as strings", () => {
    // These are not Tailwind utilities — twMerge leaves them as-is
    const result = cn("custom-123", "custom-456");
    expect(result).toBe("custom-123 custom-456");
  });
});
