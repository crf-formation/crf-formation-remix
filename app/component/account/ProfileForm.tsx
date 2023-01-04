import { useRef } from "react";
import type { FormResult } from "~/constant/types";
import type { UserMeDto } from "~/dto/user.dto";
import { profileValidator } from "~/form/user.form";
import useFormFocusError from "~/hook/useFormFocusError";
import { AuthenticityTokenInput } from "../csrf";
import FormTextField from "../form/FormTextField";
import FormView from "../form/FormView";

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
      validator={profileValidator}
    >
      <input type="hidden" name="formType" value="profile" />

      <AuthenticityTokenInput />

      <FormTextField
        name="firstName"
        ref={firstNameRef}
        defaultValue={user.firstName}
        label="First name"
        variant="standard"
        margin="normal"
        type="string"
        autoComplete="firstName"
        autoFocus
      />

      <FormTextField
        name="lastName"
        ref={lastNameRef}
        defaultValue={user.lastName}
        label="Last name"
        variant="standard"
        margin="normal"
        type="string"
        autoComplete="lastName"
      />

      <FormTextField
        name="email"
        defaultValue={user.email}
        ref={emailRef}
        label="Email"
        variant="standard"
        margin="normal"
        type="email"
        autoComplete="email"
      />
    </FormView>
  );
}