import { Box, Typography } from "@mui/material";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";
import FormTextField from "~/components/form/FormTextField";
import FormView from "~/components/form/FormView";
import PasswordCheckView from "~/components/hibp/PasswordCheckView";
import PageFullContentWithLogo from "~/components/layout/PageFullContentWithLogo";
import { passwordResetValidator } from "~/form/user.form";
import useFormFocusError from "~/hooks/useFormFocusError";
import { createPassword, verifyTokenIsValid } from "~/services/passwordrecovery.server";
import { createUserSession, getSession, getUserId } from "~/services/session.server";
import { verifyLogin } from "~/services/user.server";
import { getParamsOrFail, getSearchParamsOrFail } from "~/utils/remix.params";
import { badRequest } from "~/utils/responses";
import { badRequestWithFlash } from "~/utils/responsesError";

const ParamsSchema = z.object({
  token: z.string(),
});

const URLSearchParamsSchema = z.object({
  email: z.string()
});

export async function loader({ request, params }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");

  const { token } = getParamsOrFail(params, ParamsSchema);
  const { email } = getSearchParamsOrFail(request, URLSearchParamsSchema);

  await verifyTokenIsValid(token);

  return json({
    email,
  });
}

export async function action({ request, params  }: ActionArgs) {
  let session = await getSession(request);
  const formData = await request.formData();

	const { token } = getParamsOrFail(params, ParamsSchema)

	const email = formData.get("email") as string;
	const password = formData.get("password");
	const passwordVerification = formData.get("passwordVerification");

  // TODO: validate data using zod

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

  const userAuthToken = await verifyLogin(email, password);

  if (!userAuthToken) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    session,
    userId: userAuthToken.user.id,
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
  const { email } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [password, setPassword] = useState('bonjour1') // TODO: remove default value

  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordVerificationRef = useRef<HTMLInputElement>(null);

  useFormFocusError(actionData, [
    [ "password", passwordRef ],
    [ "passwordVerification", passwordVerificationRef ],
  ]);

  return (
    <PageFullContentWithLogo>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="h5">Finalize your account creation</Typography>

        <Typography variant="subtitle1" sx={{ md: 2, maxWidth: 300, mt: 3 }}>
          Create your password.
        </Typography>
      </Box>

      <FormView
      	submitText="Valider"
        validator={passwordResetValidator}
      >
        <input type="hidden" name="email" value={email} />

        <FormTextField
          name="password"
          ref={passwordRef}
          label="New password"
          variant="outlined"
          margin="normal"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <FormTextField
          name="passwordVerification"
          ref={passwordVerificationRef}
          label="Ret-enter your new password"
          variant="outlined"
          margin="normal"
          type="password"
          autoComplete="new-password"
          defaultValue="bonjour1"
        />

        <PasswordCheckView password={password} />
      </FormView>
    </PageFullContentWithLogo>
  );
}
