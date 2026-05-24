import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("SPEC §4.3 Python/FastAPI architecture scaffold", () => {
  it("declares the required Python web, math, and standalone packaging dependencies", () => {
    const pyprojectPath = resolve(process.cwd(), "pyproject.toml");

    expect(existsSync(pyprojectPath)).toBe(true);
    const pyproject = read("pyproject.toml");

    expect(pyproject).toContain("fastapi");
    expect(pyproject).toContain("jinja2");
    expect(pyproject).toContain("numpy");
    expect(pyproject).toContain("scipy");
    expect(pyproject).toContain("pyinstaller");
  });

  it("provides a FastAPI app serving Jinja templates and local static assets", () => {
    const appPath = resolve(process.cwd(), "python_app/main.py");

    expect(existsSync(appPath)).toBe(true);
    const app = read("python_app/main.py");

    expect(app).toContain("FastAPI");
    expect(app).toContain("Jinja2Templates");
    expect(app).toContain("StaticFiles");
    expect(app).toContain("offline-capable");
  });

  it("uses local HTMX and Tailwind assets rather than remote scripts", () => {
    const templatePath = resolve(
      process.cwd(),
      "python_app/templates/index.html"
    );
    const htmxPath = resolve(process.cwd(), "python_app/static/htmx.min.js");
    const tailwindPath = resolve(
      process.cwd(),
      "python_app/static/tailwind.css"
    );

    expect(existsSync(templatePath)).toBe(true);
    expect(existsSync(htmxPath)).toBe(true);
    expect(existsSync(tailwindPath)).toBe(true);

    const template = read("python_app/templates/index.html");

    expect(template).toContain("/static/htmx.min.js");
    expect(template).toContain("/static/tailwind.css");
    expect(template).not.toMatch(/https?:\/\//);
  });

  it("provides a numpy/scipy Python biometry core scaffold for all model families", () => {
    const corePath = resolve(process.cwd(), "python_app/biometry.py");

    expect(existsSync(corePath)).toBe(true);
    const core = read("python_app/biometry.py");

    expect(core).toContain("import numpy as np");
    expect(core).toContain("from scipy.stats import norm");
    expect(core).toContain("quadratic_mean_linear_sd");
    expect(core).toContain("per_percentile_linear");
    expect(core).toContain("linear_mean_constant_sd");
    expect(core).toContain("def zscore");
  });

  it("provides a lightweight Docker deployment artifact for the FastAPI scaffold", () => {
    const dockerfilePath = resolve(process.cwd(), "Dockerfile");

    expect(existsSync(dockerfilePath)).toBe(true);
    const dockerfile = read("Dockerfile");

    expect(dockerfile).toContain("python:3.11");
    expect(dockerfile).toContain("pyproject.toml");
    expect(dockerfile).toContain("uvicorn");
    expect(dockerfile).toContain("python_app.main:app");
    expect(dockerfile).toContain("8000");
  });
});
