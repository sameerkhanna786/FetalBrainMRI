"""Offline-capable FastAPI/Jinja entry point for SPEC §4.3."""

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .registry import evaluate_parameter


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


def _entered_measurements(form: dict[str, str]) -> list[tuple[str, str, str, str, str]]:
    rows: list[tuple[str, str, str, str, str]] = []
    for group in PARAMETER_GROUPS:
        for parameter in group["parameters"]:
            raw_value = form.get(parameter["id"], "").strip()
            if raw_value:
                rows.append(
                    (
                        group["name"],
                        parameter["id"],
                        parameter["label"],
                        raw_value,
                        parameter["unit"],
                    )
                )
    return rows


def _source_detail_text(source_details: list[dict[str, object]]) -> str:
    return "; ".join(
        f"{detail['source_label']} z {float(detail['z']):+.2f}"
        for detail in source_details
    )


def _z_value(results: dict[str, dict[str, object]], parameter_id: str) -> float | None:
    result = results.get(parameter_id)
    return None if result is None else float(result["z"])


def _python_differential_rows(
    values: dict[str, float], results: dict[str, dict[str, object]]
) -> list[str]:
    rows: list[str] = []
    atrial_values = [
        value
        for parameter_id in ("atrial_left", "atrial_right")
        if (value := values.get(parameter_id)) is not None
    ]
    max_atrium = max(atrial_values) if atrial_values else None
    if max_atrium is not None and max_atrium >= 15:
        rows.append("severe ventriculomegaly: atrial diameter is >= 15 mm.")
    elif max_atrium is not None and max_atrium >= 12:
        rows.append("moderate ventriculomegaly: atrial diameter is 12-15 mm.")
    elif max_atrium is not None and max_atrium >= 10:
        rows.append("mild ventriculomegaly: atrial diameter is 10-12 mm.")

    csp_width = values.get("csp_width")
    if csp_width is not None and csp_width < 1:
        rows.append("absent CSP: CSP width is < 1 mm.")
    elif csp_width is not None and csp_width > 10:
        rows.append("enlarged CSP: CSP width is > 10 mm.")

    third_ventricle = values.get("third_ventricle")
    if third_ventricle is not None and third_ventricle > 3.5:
        rows.append("wide third ventricle: third-ventricle width is > 3.5 mm.")

    head_z_values = [
        z_value
        for parameter_id in ("skull_bpd", "brain_bpd")
        if (z_value := _z_value(results, parameter_id)) is not None
    ]
    if head_z_values and min(head_z_values) < -1.88:
        rows.append("microcephaly: skull or brain BPD is below the 3rd percentile.")
    if head_z_values and max(head_z_values) > 1.88:
        rows.append("macrocephaly: skull or brain BPD is above the 97th percentile.")

    tcd_z = _z_value(results, "tcd")
    if tcd_z is not None and tcd_z < -1.645:
        rows.append("cerebellar hypoplasia: TCD is below the 5th percentile.")

    vermis_z_values = [
        z_value
        for parameter_id in ("vermis_cc", "vermis_ap")
        if (z_value := _z_value(results, parameter_id)) is not None
    ]
    if vermis_z_values and min(vermis_z_values) < -1.645:
        if (values.get("tva") or 0) > 23:
            rows.append("Dandy-Walker spectrum: small vermis with elevated TVA.")
        else:
            rows.append("vermian hypoplasia: vermian measurement is below the 5th percentile.")

    pons_z = _z_value(results, "pons_ap")
    if pons_z is not None and pons_z < -1.645:
        rows.append("pontocerebellar hypoplasia pattern: pons AP is below the 5th percentile.")

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
    has_abnormal_z = False
    disagreeing_rows: list[tuple[str, dict[str, object]]] = []
    numeric_values: dict[str, float] = {}
    results_by_id: dict[str, dict[str, object]] = {}

    ga_label = f"{weeks}w {days}d ({weeks + days / 7:.1f} weeks)"
    ga_weeks = weeks + days / 7
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
        for group_name, parameter_id, label, value, unit in measurements:
            if group_name != current_group:
                current_group = group_name
                lines.append(f"-- {group_name.upper()} --")
            try:
                numeric_value = float(value)
                numeric_values[parameter_id] = numeric_value
                result = evaluate_parameter(parameter_id, ga_weeks, numeric_value)
                results_by_id[parameter_id] = result
                z_value = float(result["z"])
                has_abnormal_z = has_abnormal_z or abs(z_value) > 2
                source_details = result["source_details"]
                source_text = _source_detail_text(source_details)
                if result["agreement_state"] == "disagree":
                    disagreeing_rows.append((label, result))
                lines.append(
                    f"  * {label}: {numeric_value:.1f} {unit} "
                    f"(consensus z {z_value:+.2f}, "
                    f"{float(result['percentile']):.0f} percentile; "
                    f"agreement: {result['agreement_state']}). "
                    f"Sources: {source_text}."
                )
            except (KeyError, ValueError):
                lines.append(f"  * {label}: {value} {unit}.")
    else:
        lines.append("No measurements entered.")

    if disagreeing_rows:
        lines.extend(["", "SOURCE-AGREEMENT NOTES"])
        for label, result in disagreeing_rows:
            source_text = _source_detail_text(result["source_details"])
            lines.append(
                f"{label} Delta z {float(result['disagreement_width']):.2f}: "
                f"{source_text}."
            )

    differential_rows = _python_differential_rows(numeric_values, results_by_id)
    if differential_rows:
        lines.extend(["", "DIFFERENTIAL CONSIDERATIONS"])
        for row in differential_rows:
            lines.append(f"  * {row}")

    impression = (
        differential_rows[0]
        if differential_rows
        else "One or more measurements fall outside the expected range; review source details."
        if has_abnormal_z
        else "No abnormal biometric findings."
    )
    lines.extend(["", "IMPRESSION", impression])
    return PlainTextResponse("\n".join(lines))
