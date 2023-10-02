import type { TextFieldProps } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useActionData } from "@remix-run/react";
import { useField } from "remix-validated-form";
import { generateAria2 } from "~/util/form";
import FormErrorHelperText from "./FormErrorHelperText";

type Props = TextFieldProps & { name: string }

export default function FormTextField({ name, ...props }: Props) {
  const { error, getInputProps } = useField(name);
  const actionData = useActionData();

  return (
    <>
      <TextField
        name={name}
        {...getInputProps({ id: name })}
        {...generateAria2(error, name)}
        {...props}
      />
      <FormErrorHelperText name={name} actionData={actionData} />
    </>
  );
}