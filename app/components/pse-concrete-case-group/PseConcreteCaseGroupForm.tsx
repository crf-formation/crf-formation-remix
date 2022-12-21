import { Box, Button, Stack, TextField } from "@mui/material";
import FormErrorHelperText from "../form/FormErrorHelperText";
import FormationStudentAutocomplete from "../formationpse/FormationStudentAutocomplete";
import { Form } from "@remix-run/react";
import { useRef, useEffect } from "react";
import type { UserDto } from '../../dto/user.dto';

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

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Form method="post">
        <input
          type="hidden"
          name="pseConcreteCaseSessionId"
          value={pseConcreteCaseSessionId}
        />

        <Stack
          spacing={2}
          sx={{ display: "flex", flexDirection: "column", mt: 2 }}
        >
          <TextField
            name="name"
            ref={nameRef}
            label="Nom du groupe"
            variant="standard"
            margin="normal"
            type="string"
            autoFocus
            defaultValue={name || ""}
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-describedby="name-form-error"
          />
          <FormErrorHelperText name="name" actionData={actionData} />

          <FormationStudentAutocomplete
            formationId={pseFormationId}
            defaultValue={students}
            name="students"
          />
          <FormErrorHelperText name="students" actionData={actionData} />
        </Stack>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? <span>Mettre à jour</span> : <span>Créer le groupe</span>}
          </Button>
        </Box>
      </Form>
    </Box>
  );
}