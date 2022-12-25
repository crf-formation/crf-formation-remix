import { Button, TextField } from "@mui/material";
import { useRef } from "react";
import type { FormResult } from "~/constants/types";
import { AuthenticityTokenInput } from "../csrf";
import FormErrorHelperText from "../form/FormErrorHelperText";
import useFormFocusError from "~/hooks/useFormFocusError";
import { generateAria } from "~/utils/form";
import FormView from "../form/FormView";
import type { UserMeDto } from "~/dto/user.dto";

interface ProfileFormProps {
  user: UserMeDto;
  actionData: FormResult;
}

export default function ProfileForm({ user, actionData }: ProfileFormProps) {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  
  useFormFocusError(actionData, [
    [ "firstName", firstNameRef ],
    [ "lastName", lastNameRef ],
    [ "phoneNumber", phoneNumberRef ],
    [ "email", emailRef ],
  ]);

	return (
    <FormView
      submitText="Mettre à jour"
    >
      <input type="hidden" name="formType" value="profile" />

      <AuthenticityTokenInput />

      <TextField
        name="firstName"
        ref={firstNameRef}
        defaultValue={user.firstName}
        label="First name"
        variant="standard"
        margin="normal"
        type="string"
        autoComplete="firstName"
        autoFocus
        {...generateAria(actionData, "firstName")}
      />
      <FormErrorHelperText name="firstName" actionData={actionData} />

      <TextField
        name="lastName"
        ref={lastNameRef}
        defaultValue={user.lastName}
        label="Last name"
        variant="standard"
        margin="normal"
        type="string"
        autoComplete="lastName"
        {...generateAria(actionData, "lastName")}
      />
      <FormErrorHelperText name="lastName" actionData={actionData} />

      <TextField
        name="email"
        defaultValue={user.email}
        ref={emailRef}
        label="Email"
        variant="standard"
        margin="normal"
        type="email"
        autoComplete="email"
        {...generateAria(actionData, "email")}
      />
      <FormErrorHelperText name="email" actionData={actionData} />
    </FormView>
  );
}