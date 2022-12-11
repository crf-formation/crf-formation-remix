import FormHelperText from '@mui/material/FormHelperText';

export default function FormErrorHelperText({ name, actionData }: { name: string, actionData: any }) {

	return (
    actionData?.errors &&
    actionData?.errors[name] && (
      <FormHelperText error id={`${name}-form-error`}>
        {actionData.errors[name]}
      </FormHelperText>
    )
  );
}