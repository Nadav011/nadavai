// @ts-nocheck
import "@testing-library/jest-dom/vitest";
import { configureGlobal } from "fast-check";

configureGlobal({
  seed: 42,
  numRuns: Number(process.env.FC_NUM_RUNS ?? 100),
  interruptAfterTimeLimit: 30_000,
  markInterruptAsFailure: false,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock;

class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
window.IntersectionObserver = IntersectionObserverMock;

Element.prototype.scrollIntoView = () => {};

if (!globalThis.crypto?.randomUUID) {
  Object.defineProperty(globalThis, "crypto", {
    value: {
      ...globalThis.crypto,
      randomUUID: () => "00000000-0000-4000-8000-000000000000",
    },
  });
}
