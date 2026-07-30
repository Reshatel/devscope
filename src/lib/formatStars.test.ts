import { describe, it, expect } from "vitest";
import { formatStars } from "./formatStars";

describe("formatStars", () => {
  it("показує маленькі числа як є", () => {
    expect(formatStars(0)).toBe("0");
    expect(formatStars(42)).toBe("42");
    expect(formatStars(999)).toBe("999");
  });

  it("скорочує тисячі у формат '1.2k'", () => {
    expect(formatStars(1000)).toBe("1.0k");
    expect(formatStars(1234)).toBe("1.2k");
    expect(formatStars(15600)).toBe("15.6k");
  });
});