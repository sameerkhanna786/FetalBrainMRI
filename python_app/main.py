"""Offline-capable FastAPI/Jinja entry point for SPEC §4.3.

The current production UI remains the TypeScript client while the Python
surface is brought up incrementally. This scaffold establishes the required
FastAPI, Jinja2, local-static-asset, and standalone-packaging shape without
introducing server-side PHI storage.
"""

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="Fetal Brain MRI Biometry Calculator")
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


@app.get("/", response_class=HTMLResponse)
def index(request: Request) -> HTMLResponse:
    """Render the offline-capable calculator shell."""

    return templates.TemplateResponse(
        request,
        "index.html",
        {
            "app_name": "Fetal Brain MRI Biometry Calculator",
            "privacy_posture": "client-side, no PHI storage",
        },
    )
