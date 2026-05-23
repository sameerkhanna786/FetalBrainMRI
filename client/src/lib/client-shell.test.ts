import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const sourceRoot = resolve(process.cwd(), "client/src");

const collectSourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap(entry => {
    const path = resolve(dir, entry);
    if (statSync(path).isDirectory()) return collectSourceFiles(path);
    if (!/\.[cm]?[jt]sx?$/.test(path) || /\.test\.[cm]?[jt]sx?$/.test(path)) {
      return [];
    }
    return [path];
  });

const findForbiddenSourcePatterns = (
  forbidden: { label: string; pattern: RegExp }[]
) =>
  collectSourceFiles(sourceRoot).flatMap(path => {
    const text = readFileSync(path, "utf8");
    return forbidden
      .filter(rule => rule.pattern.test(text))
      .map(rule => `${relative(sourceRoot, path)}: ${rule.label}`);
  });

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
    const forbidden = [
      { label: "localStorage", pattern: new RegExp("local" + "Storage") },
      { label: "sessionStorage", pattern: new RegExp("session" + "Storage") },
      { label: "indexedDB", pattern: new RegExp("indexed" + "DB", "i") },
      {
        label: "cookie writes",
        pattern: new RegExp("document\\s*\\.\\s*" + "cookie\\s*="),
      },
    ];

    expect(findForbiddenSourcePatterns(forbidden)).toEqual([]);
  });

  it("does not declare generic HTTP client dependencies", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(process.cwd(), "package.json"), "utf8")
    ) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const declaredPackages = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    expect(declaredPackages).not.toHaveProperty("axios");
  });

  it("does not include dynamic external script or map loaders", () => {
    const forbidden = [
      {
        label: "dynamic script creation",
        pattern: /createElement\(\s*["']script["']\s*\)/,
      },
      {
        label: "script src assignment",
        pattern: /\.src\s*=/,
      },
      {
        label: "Google Maps integration",
        pattern: /google\.maps|window\.google/i,
      },
      {
        label: "Forge proxy integration",
        pattern: /VITE_FRONTEND_FORGE|maps\/proxy/i,
      },
    ];

    expect(findForbiddenSourcePatterns(forbidden)).toEqual([]);
  });
});
