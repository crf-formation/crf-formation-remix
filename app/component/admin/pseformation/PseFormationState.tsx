
import { required, SelectInput, SelectField } from 'react-admin';
import type { SelectInputProps, SelectFieldProps } from 'react-admin';

export function FormationStateField(props: SelectFieldProps) {
	return (
    <SelectField
      {...props}
			defaultValue="CREATED"
      choices={[
        { id: "CREATED", name: "Created" },
        { id: "ENABLED", name: "Enabled" },
        { id: "DISABLED", name: "Disabled" },
        { id: "ARCHIVED", name: "Archived" },
      ]}
    />
  );
}

export function FormationStateInput(props: SelectInputProps) {
	return (
    <SelectInput
      {...props}
			defaultValue="CREATED"
      choices={[
        { id: "CREATED", name: "Created" },
        { id: "ENABLED", name: "Enabled" },
        { id: "DISABLED", name: "Disabled" },
        { id: "ARCHIVED", name: "Archived" },
      ]}
			validate={required()}
    />
  );
}