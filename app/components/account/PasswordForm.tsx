import { Box, TextField, Button } from "@mui/material";
import { Form } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import FormErrorHelperText from "../form/FormErrorHelperText";
import type { FormResult } from "~/constants/types";
import { AuthenticityTokenInput } from "../csrf";
import PasswordCheckView from "../hibp/PasswordCheckView";

interface PasswordFormProps {
  actionData: FormResult;
}

export default function PasswordForm({ actionData }: PasswordFormProps) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const passwordVerificationRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState('')

  useEffect(() => {
    if (actionData?.errors?.currentPassword) {
      currentPasswordRef.current?.focus();
    }
    if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

	return (
    <Form method="post">
      <input type="hidden" name="formType" value="password" />

      <AuthenticityTokenInput />

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          name="currentPassword"
          ref={currentPasswordRef}
          label="Current password"
          variant="standard"
          margin="normal"
          type="password"
          autoComplete="password"
          aria-invalid={actionData?.errors?.password ? true : undefined}
          aria-describedby="password-form-error"
        />
        <FormErrorHelperText name="currentPassword" actionData={actionData} />

        <TextField
          name="password"
          ref={passwordRef}
          label="Password"
          variant="standard"
          margin="normal"
          type="password"
          autoComplete="new-password"
          aria-invalid={actionData?.errors?.password ? true : undefined}
          aria-describedby="password-form-error"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <FormErrorHelperText name="password" actionData={actionData} />
        <TextField
          name="passwordVerification"
          ref={passwordVerificationRef}
          label="Retype password"
          variant="standard"
          margin="normal"
          type="password"
          autoComplete="new-password"
          aria-invalid={actionData?.errors?.passwordVerification ? true : undefined}
          aria-describedby="password-form-error"
        />
        <FormErrorHelperText
          name="passwordVerification"
          actionData={actionData}
        />

        <PasswordCheckView password={password} />
      </Box>

      <Box sx={{ marginTop: 2, display: "flex", justifyContent: "end" }}>
        <Button type="submit" variant="outlined" color="primary">
          Update password
        </Button>
      </Box>
    </Form>
  );
}
