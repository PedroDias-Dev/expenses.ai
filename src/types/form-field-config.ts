type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "checkbox"
  | "select"
  | "textarea";

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[]; // For select fields
  required?: boolean;
}
