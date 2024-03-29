import FormHelperText from "@mui/material/FormHelperText";
import { useField } from "remix-validated-form";

export default function FormErrorHelperText({ name, actionData }: { name: string, actionData?: any }) {
  const { error } = useField(name);

  // if pass directly actionData
  if (actionData) {
    return (
      actionData?.fieldErrors &&
      actionData?.fieldErrors[name] && (
        <FormHelperText error id={`${name}-form-error`}>
          {actionData.fieldErrors[name]}
        </FormHelperText>
      )
    );
  }

  // using remix-form
  if (error) {
    return (
      <FormHelperText error id={`${name}-form-error`}>
        {error}
      </FormHelperText>
    );
  }

  return null;
}
