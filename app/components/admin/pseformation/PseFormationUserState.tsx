
import { required, SelectInput, SelectField } from 'react-admin';
import type { SelectInputProps, SelectFieldProps } from 'react-admin';

export function PseFormationUserStateField(props: SelectFieldProps) {
	return (
    <SelectField
      {...props}
			defaultValue="STUDENT"
      choices={[
        { id: "STUDENT", name: "Étudiant" },
        { id: "TEACHER", name: "Formateur" },
      ]}
    />
  );
}

export function PseFormationUserStateInput(props: SelectInputProps) {
	return (
    <SelectInput
      {...props}
			defaultValue="STUDENT"
      choices={[
        { id: "STUDENT", name: "Étudiant" },
        { id: "TEACHER", name: "Formateur" },
      ]}
			validate={required()}
    />
  );
}