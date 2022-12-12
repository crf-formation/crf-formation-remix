import { Box, Button, TextField, Typography } from "@mui/material";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import PasswordCheckView from "~/components/hibp/PasswordCheckView";
import PageFullContentWithLogo from "~/components/layout/PageFullContentWithLogo";
import { createPassword, verifyTokenIsValid } from "~/services/passwordrecovery.server";
import { verifyLogin } from "~/services/user.server";
import { createUserSession, getSession, getUserId } from "~/services/session.server";
import { badRequest } from "~/utils/responses";
import { badRequestWithFlash } from "~/utils/responsesError";
import invariant from "tiny-invariant";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");

  invariant(params.token, "Missing token param")

  await verifyTokenIsValid(params.token as string)

  return json({
  });
}

export async function action({ request, params  }: ActionArgs) {
  let session = await getSession(request);
  const formData = await request.formData();

	const password = formData.get("password");
	const passwordVerification = formData.get("passwordVerification");
	const token = params.token as string;
	const email = formData.get("email") as string;

  if (typeof password !== "string" || password.length === 0) {
    return badRequest({
      password: { errors: { password: "Password is required" } },
    });
  }
	
  if (password.length < 8) {
    return badRequest({
      password: { errors: { password: "Password is too short" } },
    });
  }

	if (typeof passwordVerification !== "string" || passwordVerification.length === 0) {
    return badRequest({
      password: {
        errors: { password: "Password verification is required" },
      },
    });
  }

	if (passwordVerification !== password) {
    return badRequest({
      password: {
        errors: { password: "Passwords does not match" },
      },
    });
  }

  try { 
    await createPassword(email, token, password)
  } catch (e) {
    return badRequestWithFlash(session, e)
  }

  // password has been created, automatically login

  const proUserAuthToken = await verifyLogin(email, password);

  if (!proUserAuthToken) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    session,
    userId: proUserAuthToken.user.id,
    remember: true,
    redirectTo: "/welcome",
  });
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Finalize account creation",
  };
};

export default function PasswordResetRoute() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || '';

  const actionData = useActionData<typeof action>();

  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordVerificationRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState('bonjour1') // TODO: remove default value

  useEffect(() => {
    if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.passwordVerification) {
      passwordVerificationRef.current?.focus();
    }
  }, [actionData]);

  return (
    <PageFullContentWithLogo>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="h5">Finalize your account creation</Typography>

        <Typography variant="subtitle1" sx={{ md: 2, maxWidth: 300, mt: 3 }}>
          Create your password.
        </Typography>
      </Box>

      <Form method="post">
        <input type="hidden" name="email" value={email} />

        <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
          <TextField
            name="password"
            ref={passwordRef}
            label="New password"
            variant="outlined"
            margin="normal"
            type="password"
            autoComplete="new-password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-describedby="password-form-error"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormErrorHelperText name="password" actionData={actionData} />

          <TextField
            name="passwordVerification"
            ref={passwordVerificationRef}
            label="Ret-enter your new password"
            variant="outlined"
            margin="normal"
            type="password"
            autoComplete="new-password"
            aria-invalid={actionData?.errors?.passwordVerification ? true : undefined}
            aria-describedby="password-form-error"
            defaultValue="bonjour1"
          />
          <FormErrorHelperText
            name="passwordVerification"
            actionData={actionData}
          />

          <PasswordCheckView password={password} />
        </Box>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Box>

      </Form>
    </PageFullContentWithLogo>
  );
}
