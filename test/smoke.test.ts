import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("vitest runs correctly", () => {
    expect(1 + 1).toBe(2);
  });

  it("jsdom environment works", () => {
    const el = document.createElement("div");
    el.textContent = "hello";
    expect(el.textContent).toBe("hello");
  });
});
