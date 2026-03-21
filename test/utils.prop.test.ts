import { describe, expect } from "vitest";
import { test } from "@fast-check/vitest";
import * as fc from "fast-check";
import { cn } from "../lib/utils";

describe("cn — property tests", () => {
  test.prop([fc.string()])("single string input returns a string", (s) => {
    const result = cn(s);
    expect(typeof result).toBe("string");
  });

  test.prop([fc.string(), fc.string()])(
    "result length never exceeds combined input length plus spaces",
    (a, b) => {
      const result = cn(a, b);
      // merged result should not be longer than both inputs + separator
      expect(result.length).toBeLessThanOrEqual(a.length + b.length + 1);
    },
  );

  test.prop([fc.constant("px-4"), fc.constant("px-8")])(
    "last conflicting Tailwind class wins (tailwind-merge behavior)",
    (_first, _second) => {
      const result = cn("px-4", "px-8");
      expect(result).toContain("px-8");
      expect(result).not.toContain("px-4");
    },
  );

  test.prop([fc.boolean(), fc.constant("text-red-500")])(
    "conditional class: false removes the class",
    (condition, cls) => {
      const result = cn(condition && cls);
      if (!condition) {
        expect(result).not.toContain("text-red-500");
      }
    },
  );

  test.prop([fc.constant(undefined), fc.constant(null), fc.constant(false)])(
    "falsy inputs produce empty or trimmed string",
    (input) => {
      const result = cn(input);
      expect(result.trim()).toBe("");
    },
  );

  test.prop([fc.string()])("result has no leading/trailing whitespace", (s) => {
    const result = cn(s);
    expect(result).toBe(result.trim());
  });

  test.prop([fc.string()])("idempotent: cn(cn(x)) === cn(x)", (s) => {
    expect(cn(cn(s))).toBe(cn(s));
  });

  test.prop([fc.array(fc.string(), { minLength: 0, maxLength: 5 })])(
    "accepts variable number of arguments without throwing",
    (args) => {
      expect(() => cn(...args)).not.toThrow();
    },
  );
});
