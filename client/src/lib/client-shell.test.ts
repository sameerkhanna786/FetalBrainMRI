import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

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

  it("does not persist client state through browser storage APIs", () => {
    const sourceRoot = resolve(process.cwd(), "client/src");
    const collectSourceFiles = (dir: string): string[] =>
      readdirSync(dir).flatMap(entry => {
        const path = resolve(dir, entry);
        if (statSync(path).isDirectory()) return collectSourceFiles(path);
        if (
          !/\.[cm]?[jt]sx?$/.test(path) ||
          /\.test\.[cm]?[jt]sx?$/.test(path)
        ) {
          return [];
        }
        return [path];
      });
    const forbidden = [
      { label: "localStorage", pattern: new RegExp("local" + "Storage") },
      { label: "sessionStorage", pattern: new RegExp("session" + "Storage") },
      { label: "indexedDB", pattern: new RegExp("indexed" + "DB", "i") },
      {
        label: "cookie writes",
        pattern: new RegExp("document\\s*\\.\\s*" + "cookie\\s*="),
      },
    ];
    const offenders = collectSourceFiles(sourceRoot).flatMap(path => {
      const text = readFileSync(path, "utf8");
      return forbidden
        .filter(rule => rule.pattern.test(text))
        .map(rule => `${relative(sourceRoot, path)}: ${rule.label}`);
    });

    expect(offenders).toEqual([]);
  });
});
