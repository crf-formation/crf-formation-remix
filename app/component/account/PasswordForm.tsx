import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";
import type { FormResult } from "~/constant/types";
import { passwordModificationValidator } from "~/form/user.form";
import useFormFocusError from "~/hook/useFormFocusError";
import { generateAria } from "~/util/form";
import { AuthenticityTokenInput } from "../csrf";
import FormErrorHelperText from "../form/FormErrorHelperText";
import FormView from "../form/FormView";
import PasswordCheckView from "../hibp/PasswordCheckView";

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
    ["password", passwordRef]
  ]);

  return (
    <FormView
      submitText="Mettre à jour"
      validator={passwordModificationValidator}
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
        {...generateAria(actionData, "currentPassword")}
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
        {...generateAria(actionData, "password")}
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
        {...generateAria(actionData, "passwordVerification")}
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
