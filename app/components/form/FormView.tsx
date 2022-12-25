import { Box, Stack } from "@mui/material";
import type { Validator, FormProps } from "remix-validated-form";
import { ValidatedForm } from "remix-validated-form";
import type { ReactNode } from "react";
import SubmitButton from "./SubmitButton";

interface FormViewProps<DataType> extends FormProps<DataType> {
	children: ReactNode;
	renderAction?: ReactNode;
  submitText?: ReactNode;
  /**
   * Name of the validator to retrieve from the loader data.
   */
  validator: Validator<any>;
}

export default function FormView<DataType>({
	children,
  validator,
  submitText,
	renderAction,
  ...props
}: FormViewProps<DataType>) {
	return (
    <ValidatedForm
      method="post"
      validator={validator}
      // Why are my fields triggering the native HTML validations before remix-validated-form ones?
      // This is happening because you or the library you are using is passing the required attribute
      //  to the fields. This library doesn't take care of eliminating them and it's up to the user 
      // how they want to manage the validation errors. If you wan't to disable all native HTML 
      // validations you can add noValidate to <ValidatedForm>. We recommend this approach since 
      // the validation will still work even if JS is disabled.
      noValidate={true}
      {...props}
    >
      <Stack spacing={2} sx={{ display: "flex", flexDirection: "column" }}>
        {children}
      </Stack>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
        {renderAction || <SubmitButton>{submitText}</SubmitButton>}
      </Box>
    </ValidatedForm>
  );
}