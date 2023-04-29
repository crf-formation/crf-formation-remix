import type { SelectFieldProps, SelectInputProps } from "react-admin";
import { required, SelectField, SelectInput } from "react-admin";

export default function UserRoleInput(props: SelectInputProps) {
  return (
    <SelectInput
      {...props}
      defaultValue="USER"
      choices={[
        { id: "USER", name: "User" },
        { id: "ADMIN", name: "Admin" },
        { id: "SUPER_ADMIN", name: "Super admin" }
      ]}
      validate={required()}
    />
  );
}


export function UserRoleField(props: SelectFieldProps) {
  return (
    <SelectField
      {...props}
      defaultValue="USER"
      choices={[
        { id: "USER", name: "User" },
        { id: "ADMIN", name: "Admin" },
        { id: "SUPER_ADMIN", name: "Super admin" }
      ]}
    />
  );
}