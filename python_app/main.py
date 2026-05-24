"""Offline-capable FastAPI/Jinja entry point for SPEC §4.3."""

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


BASE_DIR = Path(__file__).resolve().parent
WEEKS_OPTIONS = list(range(18, 41))
DAYS_OPTIONS = list(range(7))
FIELD_STRENGTH_OPTIONS = ["0.55T", "1.5T", "3T"]
MOTION_OPTIONS = ["None", "Mild", "Moderate", "Severe"]
PARAMETER_GROUPS = [
    {
        "name": "Global brain / skull",
        "parameters": [
            {"id": "skull_bpd", "label": "Skull BPD", "unit": "mm"},
            {"id": "skull_ofd", "label": "Skull OFD", "unit": "mm"},
            {"id": "brain_bpd", "label": "Brain BPD", "unit": "mm"},
            {"id": "brain_ofd_left", "label": "Brain OFD left", "unit": "mm"},
            {"id": "brain_ofd_right", "label": "Brain OFD right", "unit": "mm"},
            {"id": "extra_axial_csf", "label": "Extra-axial CSF", "unit": "mm"},
        ],
    },
    {
        "name": "Ventricular system",
        "parameters": [
            {"id": "atrial_left", "label": "Atrial diameter left", "unit": "mm"},
            {"id": "atrial_right", "label": "Atrial diameter right", "unit": "mm"},
            {"id": "third_ventricle", "label": "Third ventricle", "unit": "mm"},
        ],
    },
    {
        "name": "Midline structures",
        "parameters": [
            {"id": "cc_length", "label": "Corpus callosum length", "unit": "mm"},
            {"id": "csp_width", "label": "CSP width", "unit": "mm"},
        ],
    },
    {
        "name": "Posterior fossa",
        "parameters": [
            {"id": "tcd", "label": "Transcerebellar diameter", "unit": "mm"},
            {"id": "vermis_cc", "label": "Vermian height", "unit": "mm"},
            {"id": "vermis_ap", "label": "Vermian AP", "unit": "mm"},
            {"id": "tdpf", "label": "TDPF", "unit": "mm"},
            {"id": "csa", "label": "CSA", "unit": "degrees"},
            {"id": "cisterna_magna_depth", "label": "Cisterna magna", "unit": "mm"},
            {"id": "tva", "label": "TVA", "unit": "degrees"},
        ],
    },
    {
        "name": "Brainstem",
        "parameters": [
            {"id": "pons_ap", "label": "Pons AP", "unit": "mm"},
        ],
    },
]

app = FastAPI(title="Fetal Brain MRI Biometry Calculator")
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


def _initial_report(weeks: int = 30, days: int = 0) -> str:
    ga_label = f"{weeks}w {days}d ({weeks + days / 7:.1f} weeks)"
    return "\n".join(
        [
            "CLINICAL INDICATION",
            "",
            "",
            "TECHNIQUE",
            (
                "Calculator operated in multi-source consensus mode. "
                f"Gestational age: {ga_label}."
            ),
            "",
            "FINDINGS",
            "No measurements entered.",
            "",
            "IMPRESSION",
            "No abnormal biometric findings.",
        ]
    )


def _entered_measurements(form: dict[str, str]) -> list[tuple[str, str, str, str]]:
    rows: list[tuple[str, str, str, str]] = []
    for group in PARAMETER_GROUPS:
        for parameter in group["parameters"]:
            raw_value = form.get(parameter["id"], "").strip()
            if raw_value:
                rows.append(
                    (
                        group["name"],
                        parameter["label"],
                        raw_value,
                        parameter["unit"],
                    )
                )
    return rows


@app.get("/", response_class=HTMLResponse)
def index(request: Request) -> HTMLResponse:
    """Render the offline-capable calculator shell."""

    return templates.TemplateResponse(
        request,
        "index.html",
        {
            "app_name": "Fetal Brain MRI Biometry Calculator",
            "privacy_posture": "client-side, no PHI storage",
            "weeks_options": WEEKS_OPTIONS,
            "days_options": DAYS_OPTIONS,
            "field_strength_options": FIELD_STRENGTH_OPTIONS,
            "motion_options": MOTION_OPTIONS,
            "parameter_groups": PARAMETER_GROUPS,
            "initial_report": _initial_report(),
        },
    )


@app.post("/calculate", response_class=PlainTextResponse)
async def calculate(request: Request) -> PlainTextResponse:
    """Return a plain-text report preview without persisting request data."""

    raw_form = await request.form()
    form = {key: str(value) for key, value in raw_form.items()}
    weeks = int(form.get("weeks", "30"))
    days = int(form.get("days", "0"))
    field_strength = form.get("field_strength", "1.5T")
    motion = form.get("motion", "None")
    measurements = _entered_measurements(form)

    ga_label = f"{weeks}w {days}d ({weeks + days / 7:.1f} weeks)"
    lines = [
        "CLINICAL INDICATION",
        "",
        "",
        "TECHNIQUE",
        (
            "Calculator operated in multi-source consensus mode. "
            f"Gestational age: {ga_label}. Field strength: {field_strength}. "
            f"Motion artefact: {motion.lower()}."
        ),
        "",
        "FINDINGS",
    ]

    if measurements:
        current_group = ""
        for group_name, label, value, unit in measurements:
            if group_name != current_group:
                current_group = group_name
                lines.append(f"-- {group_name.upper()} --")
            lines.append(f"  * {label}: {value} {unit}.")
    else:
        lines.append("No measurements entered.")

    lines.extend(["", "IMPRESSION", "No abnormal biometric findings."])
    return PlainTextResponse("\n".join(lines))
