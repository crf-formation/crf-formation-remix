import type { SelectFieldProps, SelectInputProps } from "react-admin";
import { required, SelectField, SelectInput } from "react-admin";

export function UserStateField(props: SelectFieldProps) {
  return (
    <SelectField
      {...props}
      defaultValue="DISABLED"
      choices={[
        { id: "CREATED", name: "Created" },
        { id: "ENABLED", name: "Enabled" },
        { id: "DISABLED", name: "Disabled" },
        { id: "ARCHIVED", name: "Archived" }
      ]}
    />
  );
}

export function UserStateInput(props: SelectInputProps) {
  return (
    <SelectInput
      {...props}
      defaultValue="DISABLED"
      choices={[
        { id: "CREATED", name: "Created" },
        { id: "ENABLED", name: "Enabled" },
        { id: "DISABLED", name: "Disabled" },
        { id: "ARCHIVED", name: "Archived" }
      ]}
      validate={required()}
    />
  );
}