export type ValidationDataFileName =
  | "case_log.csv"
  | "measurement_rows.csv"
  | "diagnostic_labels.csv"
  | "reader_study_rows.csv"
  | "report_audit_rows.csv";

export type ValidationDataRequirement = "yes" | "conditional" | "optional";

export interface ValidationDataColumnSchema {
  name: string;
  required: ValidationDataRequirement;
}

export interface ValidationDataFileSchema {
  fileName: ValidationDataFileName;
  columns: ValidationDataColumnSchema[];
}

export type ValidationDataRow = Record<
  string,
  string | number | boolean | null | undefined
>;

export const VALIDATION_DATA_FILE_ORDER: ValidationDataFileName[] = [
  "case_log.csv",
  "measurement_rows.csv",
  "diagnostic_labels.csv",
  "reader_study_rows.csv",
  "report_audit_rows.csv",
];

export const VALIDATION_DATA_SCHEMAS: Record<
  ValidationDataFileName,
  ValidationDataFileSchema
> = {
  "case_log.csv": {
    fileName: "case_log.csv",
    columns: [
      { name: "study_id", required: "yes" },
      { name: "cohort", required: "yes" },
      { name: "site_id", required: "yes" },
      { name: "scanner_vendor", required: "yes" },
      { name: "field_strength_t", required: "yes" },
      { name: "svr_method", required: "yes" },
      { name: "image_quality_tier", required: "yes" },
      { name: "ga_weeks", required: "yes" },
      { name: "ga_days", required: "yes" },
      { name: "included", required: "yes" },
      { name: "exclusion_reason", required: "conditional" },
      { name: "reference_standard_available", required: "yes" },
      { name: "prediction_available", required: "yes" },
      { name: "pathology_label_available", required: "yes" },
    ],
  },
  "measurement_rows.csv": {
    fileName: "measurement_rows.csv",
    columns: [
      { name: "study_id", required: "yes" },
      { name: "parameter_id", required: "yes" },
      { name: "source_role", required: "yes" },
      { name: "reader_id", required: "conditional" },
      { name: "value_mm", required: "conditional" },
      { name: "value_deg", required: "conditional" },
      { name: "measurement_available", required: "yes" },
      { name: "missing_reason", required: "conditional" },
      { name: "image_quality_tier", required: "yes" },
      { name: "acquisition_site", required: "optional" },
    ],
  },
  "diagnostic_labels.csv": {
    fileName: "diagnostic_labels.csv",
    columns: [
      { name: "study_id", required: "yes" },
      { name: "trigger_id", required: "yes" },
      { name: "reference_label", required: "yes" },
      { name: "predicted_label", required: "yes" },
      { name: "predicted_probability", required: "conditional" },
      { name: "threshold", required: "yes" },
      { name: "indeterminate", required: "yes" },
      { name: "indeterminate_reason", required: "conditional" },
    ],
  },
  "reader_study_rows.csv": {
    fileName: "reader_study_rows.csv",
    columns: [
      { name: "reader_id", required: "yes" },
      { name: "study_id", required: "yes" },
      { name: "condition", required: "yes" },
      { name: "read_order", required: "yes" },
      { name: "washout_days", required: "yes" },
      { name: "duration_sec", required: "yes" },
      { name: "completeness_score", required: "yes" },
      { name: "zscore_documentation_rate", required: "yes" },
      { name: "recommendation_congruent", required: "yes" },
      { name: "categorical_label", required: "optional" },
      { name: "continuous_measurement", required: "optional" },
      { name: "nasa_tlx_mental_demand", required: "conditional" },
      { name: "nasa_tlx_physical_demand", required: "conditional" },
      { name: "nasa_tlx_temporal_demand", required: "conditional" },
      { name: "nasa_tlx_performance", required: "conditional" },
      { name: "nasa_tlx_effort", required: "conditional" },
      { name: "nasa_tlx_frustration", required: "conditional" },
      { name: "sus_item_1 through sus_item_10", required: "conditional" },
    ],
  },
  "report_audit_rows.csv": {
    fileName: "report_audit_rows.csv",
    columns: [
      { name: "report_id", required: "yes" },
      { name: "phase", required: "yes" },
      { name: "duration_sec", required: "yes" },
      { name: "required_measurement_count", required: "yes" },
      { name: "documented_measurement_count", required: "yes" },
      { name: "explicit_zscore_documented", required: "yes" },
      { name: "explicit_percentile_documented", required: "yes" },
      { name: "recommendation_congruent", required: "conditional" },
    ],
  },
};

const isMissing = (
  value: string | number | boolean | null | undefined
): boolean =>
  value == null || (typeof value === "string" && value.trim() === "");

export const validateValidationDataRows = (
  fileName: string,
  rows: readonly ValidationDataRow[]
): string[] => {
  if (!(fileName in VALIDATION_DATA_SCHEMAS)) {
    return [`unknown validation data file ${fileName}`];
  }

  const schema = VALIDATION_DATA_SCHEMAS[fileName as ValidationDataFileName];
  const requiredColumns = schema.columns.filter(
    column => column.required === "yes"
  );
  const errors: string[] = [];

  rows.forEach((row, rowIndex) => {
    for (const column of requiredColumns) {
      if (isMissing(row[column.name])) {
        errors.push(
          `${schema.fileName} row ${rowIndex + 1} missing required field ${
            column.name
          }`
        );
      }
    }
  });

  return errors;
};
