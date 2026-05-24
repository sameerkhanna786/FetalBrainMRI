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
  allowedValues?: readonly string[];
  numeric?: boolean;
  min?: number;
  max?: number;
}

export interface ValidationDataFileSchema {
  fileName: ValidationDataFileName;
  columns: ValidationDataColumnSchema[];
}

export type ValidationDataRow = Record<
  string,
  string | number | boolean | null | undefined
>;

export type ValidationDataExport = Partial<
  Record<ValidationDataFileName, readonly ValidationDataRow[]>
>;

export const VALIDATION_DATA_FILE_ORDER: ValidationDataFileName[] = [
  "case_log.csv",
  "measurement_rows.csv",
  "diagnostic_labels.csv",
  "reader_study_rows.csv",
  "report_audit_rows.csv",
];

const BOOLEAN_VALUES = ["true", "false"] as const;
const NASA_TLX_COLUMNS = [
  "nasa_tlx_mental_demand",
  "nasa_tlx_physical_demand",
  "nasa_tlx_temporal_demand",
  "nasa_tlx_performance",
  "nasa_tlx_effort",
  "nasa_tlx_frustration",
] as const;
const SUS_COLUMNS = [
  "sus_item_1",
  "sus_item_2",
  "sus_item_3",
  "sus_item_4",
  "sus_item_5",
  "sus_item_6",
  "sus_item_7",
  "sus_item_8",
  "sus_item_9",
  "sus_item_10",
] as const;

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
      { name: "field_strength_t", required: "yes", numeric: true, min: 0 },
      { name: "svr_method", required: "yes" },
      { name: "image_quality_tier", required: "yes" },
      { name: "ga_weeks", required: "yes", numeric: true, min: 0 },
      { name: "ga_days", required: "yes", numeric: true, min: 0, max: 6 },
      { name: "included", required: "yes", allowedValues: BOOLEAN_VALUES },
      { name: "exclusion_reason", required: "conditional" },
      {
        name: "reference_standard_available",
        required: "yes",
        allowedValues: BOOLEAN_VALUES,
      },
      {
        name: "prediction_available",
        required: "yes",
        allowedValues: BOOLEAN_VALUES,
      },
      {
        name: "pathology_label_available",
        required: "yes",
        allowedValues: BOOLEAN_VALUES,
      },
    ],
  },
  "measurement_rows.csv": {
    fileName: "measurement_rows.csv",
    columns: [
      { name: "study_id", required: "yes" },
      { name: "parameter_id", required: "yes" },
      { name: "source_role", required: "yes" },
      { name: "reader_id", required: "conditional" },
      { name: "value_mm", required: "conditional", numeric: true },
      { name: "value_deg", required: "conditional", numeric: true },
      {
        name: "measurement_available",
        required: "yes",
        allowedValues: BOOLEAN_VALUES,
      },
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
      {
        name: "reference_label",
        required: "yes",
        allowedValues: BOOLEAN_VALUES,
      },
      {
        name: "predicted_label",
        required: "yes",
        allowedValues: BOOLEAN_VALUES,
      },
      {
        name: "predicted_probability",
        required: "conditional",
        numeric: true,
        min: 0,
        max: 1,
      },
      { name: "threshold", required: "yes", numeric: true, min: 0, max: 1 },
      { name: "indeterminate", required: "yes", allowedValues: BOOLEAN_VALUES },
      { name: "indeterminate_reason", required: "conditional" },
    ],
  },
  "reader_study_rows.csv": {
    fileName: "reader_study_rows.csv",
    columns: [
      { name: "reader_id", required: "yes" },
      { name: "study_id", required: "yes" },
      {
        name: "condition",
        required: "yes",
        allowedValues: ["without_tool", "with_tool"],
      },
      { name: "read_order", required: "yes", numeric: true, min: 1 },
      { name: "washout_days", required: "yes", numeric: true, min: 0 },
      { name: "duration_sec", required: "yes", numeric: true, min: 0 },
      { name: "completeness_score", required: "yes", numeric: true },
      {
        name: "zscore_documentation_rate",
        required: "yes",
        numeric: true,
        min: 0,
        max: 1,
      },
      {
        name: "recommendation_congruent",
        required: "conditional",
        allowedValues: BOOLEAN_VALUES,
      },
      { name: "categorical_label", required: "optional" },
      { name: "continuous_measurement", required: "optional", numeric: true },
      {
        name: "nasa_tlx_mental_demand",
        required: "conditional",
        numeric: true,
        min: 0,
        max: 100,
      },
      {
        name: "nasa_tlx_physical_demand",
        required: "conditional",
        numeric: true,
        min: 0,
        max: 100,
      },
      {
        name: "nasa_tlx_temporal_demand",
        required: "conditional",
        numeric: true,
        min: 0,
        max: 100,
      },
      {
        name: "nasa_tlx_performance",
        required: "conditional",
        numeric: true,
        min: 0,
        max: 100,
      },
      {
        name: "nasa_tlx_effort",
        required: "conditional",
        numeric: true,
        min: 0,
        max: 100,
      },
      {
        name: "nasa_tlx_frustration",
        required: "conditional",
        numeric: true,
        min: 0,
        max: 100,
      },
      {
        name: "sus_item_1",
        required: "conditional",
        numeric: true,
        min: 1,
        max: 5,
      },
      {
        name: "sus_item_2",
        required: "conditional",
        numeric: true,
        min: 1,
        max: 5,
      },
      {
        name: "sus_item_3",
        required: "conditional",
        numeric: true,
        min: 1,
        max: 5,
      },
      {
        name: "sus_item_4",
        required: "conditional",
        numeric: true,
        min: 1,
        max: 5,
      },
      {
        name: "sus_item_5",
        required: "conditional",
        numeric: true,
        min: 1,
        max: 5,
      },
      {
        name: "sus_item_6",
        required: "conditional",
        numeric: true,
        min: 1,
        max: 5,
      },
      {
        name: "sus_item_7",
        required: "conditional",
        numeric: true,
        min: 1,
        max: 5,
      },
      {
        name: "sus_item_8",
        required: "conditional",
        numeric: true,
        min: 1,
        max: 5,
      },
      {
        name: "sus_item_9",
        required: "conditional",
        numeric: true,
        min: 1,
        max: 5,
      },
      {
        name: "sus_item_10",
        required: "conditional",
        numeric: true,
        min: 1,
        max: 5,
      },
    ],
  },
  "report_audit_rows.csv": {
    fileName: "report_audit_rows.csv",
    columns: [
      { name: "report_id", required: "yes" },
      {
        name: "phase",
        required: "yes",
        allowedValues: ["baseline", "post_tool"],
      },
      { name: "duration_sec", required: "yes", numeric: true, min: 0 },
      {
        name: "required_measurement_count",
        required: "yes",
        numeric: true,
        min: 0,
      },
      {
        name: "documented_measurement_count",
        required: "yes",
        numeric: true,
        min: 0,
      },
      {
        name: "explicit_zscore_documented",
        required: "yes",
        allowedValues: BOOLEAN_VALUES,
      },
      {
        name: "explicit_percentile_documented",
        required: "yes",
        allowedValues: BOOLEAN_VALUES,
      },
      {
        name: "recommendation_congruent",
        required: "conditional",
        allowedValues: BOOLEAN_VALUES,
      },
    ],
  },
};

const isMissing = (
  value: string | number | boolean | null | undefined
): boolean =>
  value == null || (typeof value === "string" && value.trim() === "");

const isFalseLike = (
  value: string | number | boolean | null | undefined
): boolean =>
  value === false || value === 0 || value === "false" || value === "0";

const isTrueLike = (
  value: string | number | boolean | null | undefined
): boolean =>
  value === true || value === 1 || value === "true" || value === "1";

const isFiniteNumericValue = (
  value: string | number | boolean | null | undefined
): boolean => {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "string" || value.trim() === "") return false;
  return Number.isFinite(Number(value));
};

const numericValue = (
  value: string | number | boolean | null | undefined
): number | null => {
  if (!isFiniteNumericValue(value)) return null;
  return Number(value);
};

const rangeMessage = (
  rowLabel: string,
  column: ValidationDataColumnSchema
): string => {
  if (column.min != null && column.max != null) {
    return `${rowLabel} field ${column.name} must be between ${column.min} and ${column.max}`;
  }
  if (column.min != null) {
    return `${rowLabel} field ${column.name} must be greater than or equal to ${column.min}`;
  }
  return `${rowLabel} field ${column.name} must be less than or equal to ${column.max}`;
};

const pushMissingGroupFields = (
  errors: string[],
  rowLabel: string,
  row: ValidationDataRow,
  columns: readonly string[],
  groupLabel: string
): void => {
  if (!columns.some(column => !isMissing(row[column]))) return;

  for (const column of columns) {
    if (isMissing(row[column])) {
      errors.push(
        `${rowLabel} requires ${column} when any ${groupLabel} field is present`
      );
    }
  }
};

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
    const rowLabel = `${schema.fileName} row ${rowIndex + 1}`;
    for (const column of requiredColumns) {
      if (isMissing(row[column.name])) {
        errors.push(`${rowLabel} missing required field ${column.name}`);
      }
    }

    for (const column of schema.columns) {
      const value = row[column.name];
      if (isMissing(value)) continue;
      if (column.numeric && !isFiniteNumericValue(value)) {
        errors.push(`${rowLabel} field ${column.name} must be finite`);
        continue;
      }
      if (column.numeric && (column.min != null || column.max != null)) {
        const numberValue = numericValue(value);
        if (
          numberValue != null &&
          ((column.min != null && numberValue < column.min) ||
            (column.max != null && numberValue > column.max))
        ) {
          errors.push(rangeMessage(rowLabel, column));
        }
      }
      if (
        column.allowedValues &&
        !column.allowedValues.includes(String(value))
      ) {
        errors.push(
          `${rowLabel} field ${column.name} must be one of ${column.allowedValues.join(
            ", "
          )}`
        );
      }
    }

    if (
      schema.fileName === "case_log.csv" &&
      isFalseLike(row.included) &&
      isMissing(row.exclusion_reason)
    ) {
      errors.push(
        `${rowLabel} requires exclusion_reason when included is false`
      );
    }

    if (schema.fileName === "measurement_rows.csv") {
      const hasValueMm = !isMissing(row.value_mm);
      const hasValueDeg = !isMissing(row.value_deg);
      if (isTrueLike(row.measurement_available)) {
        if (!hasValueMm && !hasValueDeg) {
          errors.push(
            `${rowLabel} requires value_mm or value_deg when measurement_available is true`
          );
        }
        if (hasValueMm && hasValueDeg) {
          errors.push(
            `${rowLabel} requires exactly one of value_mm or value_deg when measurement_available is true`
          );
        }
      }
      if (
        isFalseLike(row.measurement_available) &&
        isMissing(row.missing_reason)
      ) {
        errors.push(
          `${rowLabel} requires missing_reason when measurement_available is false`
        );
      }
      if (
        isFalseLike(row.measurement_available) &&
        (hasValueMm || hasValueDeg)
      ) {
        errors.push(
          `${rowLabel} must not include value_mm or value_deg when measurement_available is false`
        );
      }
    }

    if (
      schema.fileName === "diagnostic_labels.csv" &&
      isTrueLike(row.indeterminate) &&
      isMissing(row.indeterminate_reason)
    ) {
      errors.push(
        `${rowLabel} requires indeterminate_reason when indeterminate is true`
      );
    }

    if (schema.fileName === "reader_study_rows.csv") {
      pushMissingGroupFields(
        errors,
        rowLabel,
        row,
        NASA_TLX_COLUMNS,
        "NASA Task Load Index"
      );
      pushMissingGroupFields(
        errors,
        rowLabel,
        row,
        SUS_COLUMNS,
        "System Usability Scale"
      );
    }

    if (schema.fileName === "report_audit_rows.csv") {
      const requiredMeasurementCount = numericValue(
        row.required_measurement_count
      );
      const documentedMeasurementCount = numericValue(
        row.documented_measurement_count
      );

      if (requiredMeasurementCount != null && requiredMeasurementCount <= 0) {
        errors.push(
          `${rowLabel} field required_measurement_count must be greater than 0`
        );
      }
      if (
        requiredMeasurementCount != null &&
        documentedMeasurementCount != null &&
        documentedMeasurementCount > requiredMeasurementCount
      ) {
        errors.push(
          `${rowLabel} field documented_measurement_count cannot exceed required_measurement_count`
        );
      }
    }
  });

  return errors;
};

const stringValue = (
  value: string | number | boolean | null | undefined
): string | null => (isMissing(value) ? null : String(value));

const pushMissingCaseReferences = (
  errors: string[],
  fileName: ValidationDataFileName,
  rows: readonly ValidationDataRow[],
  caseIds: Set<string>
): void => {
  rows.forEach((row, rowIndex) => {
    const studyId = stringValue(row.study_id);
    if (studyId != null && !caseIds.has(studyId)) {
      errors.push(
        `${fileName} row ${rowIndex + 1} references missing study_id ${studyId} in case_log.csv`
      );
    }
  });
};

export const validateValidationDataExport = (
  data: ValidationDataExport
): string[] => {
  const errors: string[] = [];
  for (const fileName of VALIDATION_DATA_FILE_ORDER) {
    errors.push(...validateValidationDataRows(fileName, data[fileName] ?? []));
  }

  const caseIds = new Set(
    (data["case_log.csv"] ?? [])
      .map(row => stringValue(row.study_id))
      .filter((studyId): studyId is string => studyId != null)
  );

  pushMissingCaseReferences(
    errors,
    "measurement_rows.csv",
    data["measurement_rows.csv"] ?? [],
    caseIds
  );
  pushMissingCaseReferences(
    errors,
    "diagnostic_labels.csv",
    data["diagnostic_labels.csv"] ?? [],
    caseIds
  );
  pushMissingCaseReferences(
    errors,
    "reader_study_rows.csv",
    data["reader_study_rows.csv"] ?? [],
    caseIds
  );

  const readerPairs = new Map<string, Map<string, number>>();
  for (const row of data["reader_study_rows.csv"] ?? []) {
    const readerId = stringValue(row.reader_id);
    const studyId = stringValue(row.study_id);
    const condition = stringValue(row.condition);
    if (
      readerId == null ||
      studyId == null ||
      (condition !== "without_tool" && condition !== "with_tool")
    ) {
      continue;
    }
    const key = `${readerId}\u0000${studyId}`;
    const conditionCounts = readerPairs.get(key) ?? new Map<string, number>();
    conditionCounts.set(condition, (conditionCounts.get(condition) ?? 0) + 1);
    readerPairs.set(key, conditionCounts);
  }

  readerPairs.forEach((conditionCounts, key) => {
    for (const condition of ["without_tool", "with_tool"]) {
      const count = conditionCounts.get(condition) ?? 0;
      if (count > 1) {
        const [readerId, studyId] = key.split("\u0000");
        errors.push(
          `reader_study_rows.csv reader ${readerId} study ${studyId} has ${count} ${condition} rows; expected exactly one`
        );
      }
    }
    if (
      !conditionCounts.has("without_tool") ||
      !conditionCounts.has("with_tool")
    ) {
      const [readerId, studyId] = key.split("\u0000");
      errors.push(
        `reader_study_rows.csv reader ${readerId} study ${studyId} must include both without_tool and with_tool rows`
      );
    }
  });

  return errors;
};
