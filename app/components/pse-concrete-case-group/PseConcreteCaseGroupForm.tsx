import { TextField } from "@mui/material";
import FormErrorHelperText from "../form/FormErrorHelperText";
import FormationStudentAutocomplete from "../formationpse/FormationStudentAutocomplete";
import { useRef } from "react";
import type { UserDto } from '../../dto/user.dto';
import useFormFocusError from "~/hooks/useFormFocusError";
import FormView from "../form/FormView";
import { generateAria } from "~/utils/form";

interface Props<T> {
  pseFormationId: string;
  pseConcreteCaseSessionId: string;
  actionData: T;
  // edit data
  isEdit?: boolean;
  name?: string;
  students?: Array<UserDto>;
}

export default function PseConcreteCaseGroupForm<T>({
  pseFormationId,
  pseConcreteCaseSessionId,
  actionData,
  // edit data
  isEdit,
  name,
  students,
}: Props<T>) {
  const nameRef = useRef<HTMLInputElement>(null);

  useFormFocusError(actionData, [
    [ "name", nameRef ],
  ]);

  return (
    <FormView
      submitText={isEdit ? <span>Mettre à jour</span> : <span>Créer le groupe</span>}
    >
      <input
        type="hidden"
        name="pseConcreteCaseSessionId"
        value={pseConcreteCaseSessionId}
      />

      <TextField
        name="name"
        ref={nameRef}
        label="Nom du groupe"
        variant="standard"
        margin="normal"
        type="string"
        autoFocus
        defaultValue={name || ""}
        {...generateAria(actionData, "name")}
      />
      <FormErrorHelperText name="name" actionData={actionData} />

      <FormationStudentAutocomplete
        formationId={pseFormationId}
        defaultValue={students}
        name="students"
        {...generateAria(actionData, "students")}
      />
      <FormErrorHelperText name="students" actionData={actionData} />
    </FormView>
  );
}