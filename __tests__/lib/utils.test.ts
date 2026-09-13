import { riskColor, riskIcon, changeTypeColor, checkRateLimit } from "@/lib/utils";

describe("riskColor", () => {
  it("returns red classes for high risk", () => {
    expect(riskColor("high")).toContain("red");
  });
  it("returns amber classes for medium risk", () => {
    expect(riskColor("medium")).toContain("amber");
  });
  it("returns emerald classes for low risk", () => {
    expect(riskColor("low")).toContain("emerald");
  });
  it("returns slate classes for neutral", () => {
    expect(riskColor("neutral")).toContain("slate");
  });
});

describe("riskIcon", () => {
  it("returns warning emoji for high", () => {
    expect(riskIcon("high")).toBe("⚠️");
  });
  it("returns check emoji for low", () => {
    expect(riskIcon("low")).toBe("✅");
  });
});

describe("changeTypeColor", () => {
  it("returns emerald for added", () => {
    expect(changeTypeColor("added")).toContain("emerald");
  });
  it("returns red for removed", () => {
    expect(changeTypeColor("removed")).toContain("red");
  });
  it("returns blue for modified", () => {
    expect(changeTypeColor("modified")).toContain("blue");
  });
});

describe("checkRateLimit", () => {
  it("allows requests within limit", () => {
    expect(checkRateLimit("test-ip-1")).toBe(true);
    expect(checkRateLimit("test-ip-1")).toBe(true);
  });

  it("tracks different IPs independently", () => {
    expect(checkRateLimit("ip-a")).toBe(true);
    expect(checkRateLimit("ip-b")).toBe(true);
  });
});
