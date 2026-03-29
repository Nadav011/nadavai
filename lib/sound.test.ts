/**
 * lib/sound.test.ts
 *
 * Design notes:
 *
 * 1. sound.ts reads matchMedia at module top-level to set the `reducedMotion` flag.
 *    We control this by setting matchMedia BEFORE the module is imported, then using
 *    vi.resetModules() + dynamic import() so each test gets a fresh module instance.
 *
 * 2. vi.fn(() => ...) uses an arrow function, which cannot be used as a constructor.
 *    `new vi.fn(...)` throws silently (sound.ts catches it), and play() is never called.
 *    We use a regular function inside the vi.mock factory so `new Howl(opts)` works.
 *
 * 3. We track state via a module-level `mockState` object that the mock factory
 *    closes over. The object is mutated in-place, so it stays valid across
 *    vi.resetModules() calls (which re-evaluate the factory but share the same closure).
 *
 * 4. playSound() is fire-and-forget (uses `void promise.then(...)`). The Howl
 *    constructor is reached only after `import("howler")` resolves. We must flush
 *    the microtask queue with `await flush()` before asserting on mockState when
 *    sound is ENABLED (disabled early-returns synchronously, so no flush needed).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Shared mock state — mutated in-place, stable across module resets
interface HowlOpts { src: string[]; volume: number; preload: boolean }
const mockState = {
  constructorCalls: [] as HowlOpts[],
  playCalls: 0,
  throwOnConstruct: false,
  throwOnPlay: false,
};

// Use a regular function (not arrow) so `new Howl(opts)` works as a constructor.
vi.mock("howler", () => {
  function MockHowl(this: object, opts: HowlOpts) {
    if (mockState.throwOnConstruct) throw new Error("Mock constructor error");
    mockState.constructorCalls.push(opts);
    Object.assign(this, {
      play() {
        if (mockState.throwOnPlay) throw new Error("Mock play error");
        mockState.playCalls++;
      },
    });
  }
  return { Howl: MockHowl };
});

// Flush the async chain inside playSound (loadHowler -> import("howler") -> new Howl -> .play())
const flush = () => new Promise<void>((r) => setTimeout(r, 0));

// matchMedia helper
function setMatchMedia(prefersReduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: query.includes("reduce") ? prefersReduced : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    })),
  });
}

const STORAGE_KEY = "nadavai-sound-enabled";

describe("sound module", () => {
  beforeEach(() => {
    vi.resetModules();
    mockState.constructorCalls.length = 0;
    mockState.playCalls = 0;
    mockState.throwOnConstruct = false;
    mockState.throwOnPlay = false;
    setMatchMedia(false);
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // isSoundEnabled
  describe("isSoundEnabled()", () => {
    it("returns false by default", async () => {
      const { isSoundEnabled } = await import("./sound");
      expect(isSoundEnabled()).toBe(false);
    });

    it("returns true when localStorage has 'true'", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { isSoundEnabled } = await import("./sound");
      expect(isSoundEnabled()).toBe(true);
    });

    it("returns false when localStorage has 'false'", async () => {
      localStorage.setItem(STORAGE_KEY, "false");
      const { isSoundEnabled } = await import("./sound");
      expect(isSoundEnabled()).toBe(false);
    });

    it("returns false for an unrecognised stored value", async () => {
      localStorage.setItem(STORAGE_KEY, "yes");
      const { isSoundEnabled } = await import("./sound");
      expect(isSoundEnabled()).toBe(false);
    });

    it("returns false when localStorage.getItem throws", async () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("SecurityError");
      });
      const { isSoundEnabled } = await import("./sound");
      expect(isSoundEnabled()).toBe(false);
    });
  });

  // toggleSound
  describe("toggleSound()", () => {
    it("toggles from disabled to enabled and returns true", async () => {
      const { toggleSound, isSoundEnabled } = await import("./sound");
      expect(toggleSound()).toBe(true);
      expect(isSoundEnabled()).toBe(true);
    });

    it("toggles from enabled to disabled and returns false", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { toggleSound, isSoundEnabled } = await import("./sound");
      expect(toggleSound()).toBe(false);
      expect(isSoundEnabled()).toBe(false);
    });

    it("persists the toggled value in localStorage", async () => {
      const { toggleSound } = await import("./sound");
      toggleSound();
      expect(localStorage.getItem(STORAGE_KEY)).toBe("true");
      toggleSound();
      expect(localStorage.getItem(STORAGE_KEY)).toBe("false");
    });

    it("two consecutive toggles return to original state", async () => {
      const { toggleSound, isSoundEnabled } = await import("./sound");
      const initial = isSoundEnabled();
      toggleSound();
      toggleSound();
      expect(isSoundEnabled()).toBe(initial);
    });

    it("returns false when localStorage.setItem throws", async () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
      const { toggleSound } = await import("./sound");
      expect(toggleSound()).toBe(false);
    });
  });

  // playSound
  describe("playSound()", () => {
    // When sound is disabled, playSound returns synchronously before any async code.
    // No flush needed — assertions are valid immediately.
    it("does not construct Howl when sound is disabled (default)", async () => {
      const { playSound } = await import("./sound");
      playSound("click");
      expect(mockState.constructorCalls).toHaveLength(0);
    });

    it("does not call play when sound is disabled", async () => {
      const { playSound } = await import("./sound");
      playSound("click");
      expect(mockState.playCalls).toBe(0);
    });

    // When sound is enabled, playSound fires `void promise.then(...)` -- the Howl
    // constructor runs after `import("howler")` resolves. We must flush first.
    it("constructs a Howl and calls play when sound is enabled", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      playSound("click");
      await flush();
      expect(mockState.constructorCalls).toHaveLength(1);
      expect(mockState.playCalls).toBe(1);
    });

    it("does not play when prefers-reduced-motion is active", async () => {
      setMatchMedia(true);
      vi.resetModules();
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      playSound("click");
      // reducedMotion guard fires synchronously -- no flush needed
      expect(mockState.constructorCalls).toHaveLength(0);
      expect(mockState.playCalls).toBe(0);
    });

    it("creates Howl lazily on first play", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      expect(mockState.constructorCalls).toHaveLength(0);
      playSound("hover");
      await flush();
      expect(mockState.constructorCalls).toHaveLength(1);
    });

    it("reuses same Howl on repeated plays for same type", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      playSound("hover");
      await flush();
      playSound("hover");
      await flush();
      expect(mockState.constructorCalls).toHaveLength(1);
      expect(mockState.playCalls).toBe(2);
    });

    it("creates separate Howl instances per sound type", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      playSound("click");
      await flush();
      playSound("whoosh");
      await flush();
      expect(mockState.constructorCalls).toHaveLength(2);
    });

    it("uses volume 0.25 for hover", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      playSound("hover");
      await flush();
      expect(mockState.constructorCalls[0]?.volume).toBe(0.25);
    });

    it("uses volume 0.35 for whoosh", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      playSound("whoosh");
      await flush();
      expect(mockState.constructorCalls[0]?.volume).toBe(0.35);
    });

    it("uses volume 0.5 for click", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      playSound("click");
      await flush();
      expect(mockState.constructorCalls[0]?.volume).toBe(0.5);
    });

    it("uses volume 0.5 for success", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      playSound("success");
      await flush();
      expect(mockState.constructorCalls[0]?.volume).toBe(0.5);
    });

    it("sets preload: false on every Howl instance", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      playSound("click");
      await flush();
      expect(mockState.constructorCalls[0]?.preload).toBe(false);
    });

    it("passes correct src for hover", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      playSound("hover");
      await flush();
      expect(mockState.constructorCalls[0]?.src).toEqual(["/sounds/hover.mp3"]);
    });

    it("passes correct src for click", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      playSound("click");
      await flush();
      expect(mockState.constructorCalls[0]?.src).toEqual(["/sounds/click.mp3"]);
    });

    it("passes correct src for whoosh", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      playSound("whoosh");
      await flush();
      expect(mockState.constructorCalls[0]?.src).toEqual(["/sounds/whoosh.mp3"]);
    });

    it("passes correct src for success", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      playSound("success");
      await flush();
      expect(mockState.constructorCalls[0]?.src).toEqual(["/sounds/success.mp3"]);
    });

    it("does not throw when Howl constructor throws", async () => {
      mockState.throwOnConstruct = true;
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      expect(() => playSound("click")).not.toThrow();
      // Verify the async path also swallows the error gracefully
      await flush();
      expect(mockState.playCalls).toBe(0);
    });

    it("does not throw when howl.play() throws", async () => {
      mockState.throwOnPlay = true;
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      expect(() => playSound("click")).not.toThrow();
      await flush();
      // play() threw, but the outer try/catch in sound.ts ate the error
      expect(mockState.constructorCalls).toHaveLength(1);
    });
  });

  // SoundType exhaustiveness
  describe("SoundType exhaustiveness", () => {
    it("accepts all four sound types without throwing", async () => {
      localStorage.setItem(STORAGE_KEY, "true");
      const { playSound } = await import("./sound");
      for (const t of ["hover", "click", "whoosh", "success"] as const) {
        expect(() => playSound(t)).not.toThrow();
      }
      await flush();
    });
  });
});
