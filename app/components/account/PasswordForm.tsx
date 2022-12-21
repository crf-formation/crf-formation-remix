import { TextField, Button } from "@mui/material";
import { useRef, useState } from "react";
import FormErrorHelperText from "../form/FormErrorHelperText";
import type { FormResult } from "~/constants/types";
import { AuthenticityTokenInput } from "../csrf";
import PasswordCheckView from "../hibp/PasswordCheckView";
import useFormFocusError from "~/hooks/useFormFocusError";
import FormView from "../form/FormView";
import { generateAria } from "~/utils/form";

interface PasswordFormProps {
  actionData: FormResult;
}

export default function PasswordForm({ actionData }: PasswordFormProps) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const passwordVerificationRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState("");

  useFormFocusError(actionData, [
    ["currentPassword", currentPasswordRef],
    ["password", passwordRef],
  ]);

  return (
    <FormView
      action={
        <Button type="submit" variant="outlined" color="primary">
          Update password
        </Button>
      }
    >
      <input type="hidden" name="formType" value="password" />

      <AuthenticityTokenInput />

      <TextField
        name="currentPassword"
        ref={currentPasswordRef}
        label="Current password"
        variant="standard"
        margin="normal"
        type="password"
        autoComplete="password"
        {...generateAria(actionData, 'currentPassword')}
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
        {...generateAria(actionData, 'password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FormErrorHelperText name="password" actionData={actionData} />

      <TextField
        name="passwordVerification"
        ref={passwordVerificationRef}
        label="Retype password"
        variant="standard"
        margin="normal"
        type="password"
        {...generateAria(actionData, 'passwordVerification')}
        aria-describedby="password-form-error"
      />
      <FormErrorHelperText
        name="passwordVerification"
        actionData={actionData}
      />

      <PasswordCheckView password={password} />

    </FormView>
  );
}
