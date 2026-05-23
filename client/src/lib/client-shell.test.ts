import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("SPEC §4.9 client privacy shell", () => {
  it("does not include analytics or telemetry script hooks", () => {
    const htmlPath = [
      resolve(process.cwd(), "client/index.html"),
      resolve(process.cwd(), "index.html"),
    ].find(existsSync);
    if (!htmlPath) throw new Error("Missing client index.html");
    const html = readFileSync(htmlPath, "utf8");

    expect(html).not.toMatch(/VITE_ANALYTICS|umami|data-website-id/i);
    expect(html).not.toMatch(/https?:\/\/|fonts\.googleapis|fonts\.gstatic/i);
    expect(html).not.toMatch(/rel="preconnect"/i);
  });
});
