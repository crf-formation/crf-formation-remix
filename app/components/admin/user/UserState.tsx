
import { required, SelectInput, SelectField } from 'react-admin';
import type { SelectInputProps, SelectFieldProps } from 'react-admin';

export function UserStateField(props: SelectFieldProps) {
	return (
    <SelectField
      {...props}
			defaultValue="DISABLED"
      choices={[
        { id: "ENABLED", name: "Enabled" },
        { id: "DISABLED", name: "Disabled" },
        { id: "ARCHIVED", name: "Archived" },
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
        { id: "ENABLED", name: "Enabled" },
        { id: "DISABLED", name: "Disabled" },
        { id: "ARCHIVED", name: "Archived" },
      ]}
			validate={required()}
    />
  );
}