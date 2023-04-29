import { AutocompleteInput, FunctionField, ReferenceField, ReferenceInput } from "react-admin";
import type { UserDto } from "~/dto/user.dto";

interface Props {
  source: string;
}

export function TeacherReferenceField({ source }: Props) {
  return (
    <ReferenceField label="Teacher" reference="teacher" source={source} fullWidth>
      <FunctionField render={(teacher: UserDto) => teacher && teacher.fullName} />
    </ReferenceField>
  );
}

export function TeacherReferenceInput({ source }: Props) {
  return (
    <ReferenceInput reference="user" /*filter={{ isTeacher: true }}*/ source={source} fullWidth>
      <AutocompleteInput
        fullWidth
        label="Formateur"
        optionText={(teacher: UserDto) =>
          teacher == null ? "not defined" : teacher.fullName
        }
      />
    </ReferenceInput>
  );
}