import { riskColor, riskIcon, changeTypeColor, checkRateLimit, sanitizeInput } from "@/lib/utils";

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
  it("returns yellow circle for medium", () => {
    expect(riskIcon("medium")).toBe("🟡");
  });
  it("returns document emoji for neutral", () => {
    expect(riskIcon("neutral")).toBe("📄");
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

  it("blocks after 20 requests from the same IP", () => {
    const testIp = `rate-limit-test-${Date.now()}`;
    // First 20 should succeed
    for (let i = 0; i < 20; i++) {
      expect(checkRateLimit(testIp)).toBe(true);
    }
    // 21st should be blocked
    expect(checkRateLimit(testIp)).toBe(false);
  });
});

describe("sanitizeInput", () => {
  it("strips HTML tags", () => {
    expect(sanitizeInput("<script>alert('xss')</script>Hello")).toBe("Hello");
  });

  it("strips nested HTML", () => {
    expect(sanitizeInput("<b>bold</b> text")).toBe("bold text");
  });

  it("removes HTML entities", () => {
    const result = sanitizeInput("Hello &amp; world");
    expect(result).not.toContain("&amp;");
  });

  it("trims leading and trailing whitespace", () => {
    expect(sanitizeInput("  hello world  ")).toBe("hello world");
  });

  it("preserves normal text unchanged", () => {
    expect(sanitizeInput("What are my obligations under Section 5?")).toBe(
      "What are my obligations under Section 5?"
    );
  });

  it("removes control characters", () => {
    expect(sanitizeInput("hello\x00world\x07")).toBe("helloworld");
  });

  it("handles empty string", () => {
    expect(sanitizeInput("")).toBe("");
  });

  it("handles string with only HTML", () => {
    expect(sanitizeInput("<div><p></p></div>")).toBe("");
  });
});
