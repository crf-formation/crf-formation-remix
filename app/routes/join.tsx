import { Box, Button, Link, TextField } from "@mui/material";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { isEmpty } from "lodash";
import { useEffect, useRef, useState } from "react";
import { createUser, findUserByEmail, validateUserEmail } from "~/services/user.server";
import { createUserSession, getSession, getUserId } from "~/services/session.server";
import { badRequest } from "~/utils/responses";
// import { safeRedirect } from "~/utils/routing";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import PasswordCheckView from "~/components/hibp/PasswordCheckView";
import PageFullContentWithLogo from "~/components/layout/PageFullContentWithLogo";
import { USER_PASSWORD_MIN_LENGTH } from "~/constants";
import { UserPostDto } from "~/dto/user.dto";
import { safeRedirect } from "~/utils/routing";
import type { UserPostApiObject } from "~/apiobject/user.apiobject";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const session = await getSession(request);

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (isEmpty(firstName)) {
    return badRequest({
      errors: { email: "First name required", password: null },
    });
  }

  if (isEmpty(lastName)) {
    return badRequest({
      errors: { email: "Last name required", password: null },
    });
  }

  if (!validateUserEmail(email)) {
    return badRequest({
      errors: { email: "Email is invalid", password: null },
    });
  }

  if (typeof password !== "string" || password.length === 0) {
    return badRequest({
      errors: { email: null, password: "Password is required" },
    });
  }

  if (password.length < USER_PASSWORD_MIN_LENGTH) {
    return badRequest({
      errors: { email: null, password: "Password is too short" },
    });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 }
    );
  }

  const userPostApiObject: UserPostApiObject = {
    firstName: firstName as string,
    lastName: lastName as string,
    state: 'DISABLED',
    email,
    password
  }

  const user = await createUser(userPostApiObject);

  return createUserSession({
    session,
    userId: user.id,
    remember: false,
    redirectTo,
  });
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Inscription",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState('')

  useEffect(() => {
    if (actionData?.errors?.firstName) {
      firstNameRef.current?.focus();
    } else if (actionData?.errors?.lastName) {
      lastNameRef.current?.focus();
    } else if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <PageFullContentWithLogo>
      <Form method="post">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            name="firstName"
            ref={firstNameRef}
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
            name="email"
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormErrorHelperText name="password" actionData={actionData} />

          <PasswordCheckView password={password} />
        </Box>

        <Box sx={{ marginTop: 2, display: "flex", justifyContent: "end" }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create account
          </Button>
        </Box>

        <Box mt={3} textAlign="center">
          Already have an account?{" "}
          <Link href={`/login?${searchParams.toString()}`}>Log in</Link>
        </Box>
      </Form>
    </PageFullContentWithLogo>
  );
}
