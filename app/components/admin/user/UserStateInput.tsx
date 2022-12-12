
import { required, SelectInput } from 'react-admin';
import type { SelectInputProps } from 'react-admin';

export default function StateInput(props: SelectInputProps) {
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