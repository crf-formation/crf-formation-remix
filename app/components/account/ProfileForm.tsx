import { Box, Button, TextField } from "@mui/material";
import { Form } from "@remix-run/react";
import { useEffect, useRef } from "react";
import type { FormResult } from "~/constants/types";
import type { ProUserMeDto } from '../../dto/prouser.dto';
import { AuthenticityTokenInput } from "../csrf";
import FormErrorHelperText from "../form/FormErrorHelperText";

interface ProfileFormProps {
  user: ProUserMeDto;
  actionData: FormResult;
}

export default function ProfileForm({ user, actionData }: ProfileFormProps) {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.firstName) {
      firstNameRef.current?.focus();
    } else if (actionData?.errors?.lastName) {
      lastNameRef.current?.focus();
    } else if (actionData?.errors?.phoneNumber) {
      phoneNumberRef.current?.focus()
    } else if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } 
  }, [actionData]);

	return (
    <Form method="post">
      <input type="hidden" name="formType" value="profile" />

      <AuthenticityTokenInput />

      <Box sx={{ display: "flex", flexDirection: "column" }}>
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
          aria-invalid={actionData?.errors?.firstName ? true : undefined}
          aria-describedby="firstName-form-error"
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
          aria-invalid={actionData?.errors?.lastName ? true : undefined}
          aria-describedby="lastName-form-error"
        />
        <FormErrorHelperText name="lastName" actionData={actionData} />

        <TextField
          name="phoneNumber"
					ref={phoneNumberRef}
					defaultValue={user.phoneNumber}
          label="Phone number"
          variant="standard"
          margin="normal"
          type="string"
          autoComplete="phoneNumber"
          aria-invalid={actionData?.errors?.phoneNumber ? true : undefined}
          aria-describedby="phoneNumber-form-error"
        />
        <FormErrorHelperText name="phoneNumber" actionData={actionData} />

        <TextField
          name="email"
					defaultValue={user.email}
          ref={emailRef}
          label="Email"
          variant="standard"
          margin="normal"
          type="email"
          autoComplete="email"
          aria-invalid={actionData?.errors?.email ? true : undefined}
          aria-describedby="email-form-error"
        />
        <FormErrorHelperText name="email" actionData={actionData} />

      </Box>

      <Box sx={{ marginTop: 2, display: "flex", justifyContent: "end" }}>
        <Button type="submit" variant="outlined" color="primary">
          Update profile
        </Button>
      </Box>
    </Form>
  );
}