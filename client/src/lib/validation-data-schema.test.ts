import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  VALIDATION_DATA_FILE_ORDER,
  VALIDATION_DATA_SCHEMAS,
  validateValidationDataRows,
} from "./validation-data-schema";

describe("validation data export schema guard", () => {
  it("keeps runtime schemas aligned with the validation data dictionary", () => {
    const dictionary = readFileSync(
      resolve(process.cwd(), "validation_data_dictionary.md"),
      "utf8"
    );

    expect(VALIDATION_DATA_FILE_ORDER).toEqual([
      "case_log.csv",
      "measurement_rows.csv",
      "diagnostic_labels.csv",
      "reader_study_rows.csv",
      "report_audit_rows.csv",
    ]);

    for (const fileName of VALIDATION_DATA_FILE_ORDER) {
      const schema = VALIDATION_DATA_SCHEMAS[fileName];
      expect(dictionary).toContain(fileName);
      expect(schema.columns.some(column => column.required === "yes")).toBe(
        true
      );
      for (const column of schema.columns) {
        expect(dictionary).toContain(column.name);
      }
    }
  });

  it("accepts minimal valid rows for every export file", () => {
    const rowsByFile = {
      "case_log.csv": [
        {
          study_id: "S1",
          cohort: "institutional",
          site_id: "single_site",
          scanner_vendor: "unknown",
          field_strength_t: 1.5,
          svr_method: "none",
          image_quality_tier: "diagnostic",
          ga_weeks: 28,
          ga_days: 0,
          included: true,
          reference_standard_available: true,
          prediction_available: true,
          pathology_label_available: true,
        },
      ],
      "measurement_rows.csv": [
        {
          study_id: "S1",
          parameter_id: "tcd",
          source_role: "reference",
          value_mm: 32,
          measurement_available: true,
          image_quality_tier: "diagnostic",
        },
      ],
      "diagnostic_labels.csv": [
        {
          study_id: "S1",
          trigger_id: "mild-vm",
          reference_label: false,
          predicted_label: false,
          threshold: 0.5,
          indeterminate: false,
        },
      ],
      "reader_study_rows.csv": [
        {
          reader_id: "R1",
          study_id: "S1",
          condition: "without_tool",
          read_order: 1,
          washout_days: 14,
          duration_sec: 300,
          completeness_score: 0.8,
          zscore_documentation_rate: 0.75,
          recommendation_congruent: true,
        },
      ],
      "report_audit_rows.csv": [
        {
          report_id: "P1",
          phase: "baseline",
          duration_sec: 600,
          required_measurement_count: 8,
          documented_measurement_count: 6,
          explicit_zscore_documented: false,
          explicit_percentile_documented: false,
        },
      ],
    } as const;

    for (const [fileName, rows] of Object.entries(rowsByFile)) {
      expect(validateValidationDataRows(fileName, rows)).toEqual([]);
    }
  });

  it("rejects missing required fields before metrics are computed", () => {
    expect(
      validateValidationDataRows("case_log.csv", [
        {
          study_id: "",
          cohort: "institutional",
        },
      ])
    ).toEqual(
      expect.arrayContaining([
        "case_log.csv row 1 missing required field study_id",
        "case_log.csv row 1 missing required field site_id",
        "case_log.csv row 1 missing required field ga_weeks",
      ])
    );

    expect(
      validateValidationDataRows("measurement_rows.csv", [
        {
          study_id: "S1",
          source_role: "reference",
        },
      ])
    ).toContain(
      "measurement_rows.csv row 1 missing required field parameter_id"
    );
  });

  it("rejects conditional, enum, and numeric export errors before analysis", () => {
    expect(
      validateValidationDataRows("case_log.csv", [
        {
          study_id: "S1",
          cohort: "institutional",
          site_id: "single_site",
          scanner_vendor: "unknown",
          field_strength_t: "not-a-number",
          svr_method: "none",
          image_quality_tier: "diagnostic",
          ga_weeks: 28,
          ga_days: 0,
          included: false,
          reference_standard_available: true,
          prediction_available: true,
          pathology_label_available: true,
        },
      ])
    ).toEqual(
      expect.arrayContaining([
        "case_log.csv row 1 requires exclusion_reason when included is false",
        "case_log.csv row 1 field field_strength_t must be finite",
      ])
    );

    expect(
      validateValidationDataRows("measurement_rows.csv", [
        {
          study_id: "S1",
          parameter_id: "tcd",
          source_role: "reference",
          measurement_available: true,
          image_quality_tier: "diagnostic",
        },
        {
          study_id: "S2",
          parameter_id: "tcd",
          source_role: "reference",
          measurement_available: false,
          image_quality_tier: "diagnostic",
        },
      ])
    ).toEqual(
      expect.arrayContaining([
        "measurement_rows.csv row 1 requires value_mm or value_deg when measurement_available is true",
        "measurement_rows.csv row 2 requires missing_reason when measurement_available is false",
      ])
    );

    expect(
      validateValidationDataRows("diagnostic_labels.csv", [
        {
          study_id: "S1",
          trigger_id: "mild-vm",
          reference_label: false,
          predicted_label: false,
          threshold: 0.5,
          indeterminate: true,
        },
      ])
    ).toContain(
      "diagnostic_labels.csv row 1 requires indeterminate_reason when indeterminate is true"
    );

    expect(
      validateValidationDataRows("reader_study_rows.csv", [
        {
          reader_id: "R1",
          study_id: "S1",
          condition: "tool",
          read_order: 1,
          washout_days: 14,
          duration_sec: 300,
          completeness_score: 0.8,
          zscore_documentation_rate: 0.75,
          recommendation_congruent: true,
        },
      ])
    ).toContain(
      "reader_study_rows.csv row 1 field condition must be one of without_tool, with_tool"
    );

    expect(
      validateValidationDataRows("report_audit_rows.csv", [
        {
          report_id: "P1",
          phase: "pilot",
          duration_sec: 600,
          required_measurement_count: 8,
          documented_measurement_count: 6,
          explicit_zscore_documented: false,
          explicit_percentile_documented: false,
        },
      ])
    ).toContain(
      "report_audit_rows.csv row 1 field phase must be one of baseline, post_tool"
    );
  });
});
