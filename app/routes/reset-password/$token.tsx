import { Box, TextField, Typography } from "@mui/material";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import PasswordCheckView from "~/components/hibp/PasswordCheckView";
import PageFullContentWithLogo from "~/components/layout/PageFullContentWithLogo";
import { addFlashMessage } from "~/services/flash.server";
import { recoverPassword } from "~/services/passwordrecovery.server";
import { commitSession, getSession, getUserId } from "~/services/session.server";
import { getParamsOrFail, getSearchParamsOrFail } from "~/utils/remix.params";
import { badRequest } from "~/utils/responses";
import { badRequestWithFlash } from "~/utils/responsesError";
import type { ApiErrorException } from '../../services/api.error';
import useFormFocusError from "~/hooks/useFormFocusError";
import FormView from "~/components/form/FormView";
import { generateAria } from "~/utils/form";

const ParamsSchema = z.object({
  token: z.string(),
});

const URLSearchParamsSchema = z.object({
  email: z.string()
});

export async function loader({ request, }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");

  const { email } = getSearchParamsOrFail(request, URLSearchParamsSchema);

  return json({
    email
  });
}

export async function action({ request, params  }: ActionArgs) {
  let session = await getSession(request);
  const formData = await request.formData();

	const { token } = getParamsOrFail(params, ParamsSchema)

	const password = formData.get("password");
	const passwordVerification = formData.get("passwordVerification");
	const email = formData.get("email") as string;

  // TODO: validate data using zod
  if (typeof password !== "string" || password.length === 0) {
    return badRequest({
      errors: { password: "Password is required" }
    });
  }
	
  if (password.length < 8) {
    return badRequest({
      errors: { password: "Password is too short" },
    });
  }

	if (typeof passwordVerification !== "string" || passwordVerification.length === 0) {
    return badRequest({
        errors: { passwordVerification: "Password verification is required" },
    });
  }

	if (passwordVerification !== password) {
    return badRequest({
        errors: { passwordVerification: "Passwords does not match" },
    });
  }

  try { 
    await recoverPassword(email, token, password)
  } catch (e) {
    return badRequestWithFlash(session, e as ApiErrorException)
  }

	session = await addFlashMessage(
		request,
		"success",
    `Your password has been updated`
  );

  return redirect(`/login?email=${email}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Password modification",
  };
};

export default function PasswordResetRoute() {
  const { email } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [password, setPassword] = useState("");

  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordVerificationRef = useRef<HTMLInputElement>(null);

  useFormFocusError(actionData, [
    ["password", passwordRef],
    ["passwordVerification", passwordVerificationRef],
  ]);

  return (
    <PageFullContentWithLogo>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="h5">Reset your password</Typography>

        <Typography variant="subtitle1" sx={{ md: 2, maxWidth: 300, mt: 3 }}>
          Enter your new password.
        </Typography>
      </Box>

      <FormView
        submitText="Valider"
        // TODO: validator
      >
        <input type="hidden" name="email" value={email} />

        <TextField
          name="password"
          ref={passwordRef}
          label="New password"
          variant="outlined"
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
          label="Ret-enter your new password"
          variant="outlined"
          margin="normal"
          type="password"
          autoComplete="new-password"
          {...generateAria(actionData, "passwordVerification")}
        />
        <FormErrorHelperText
          name="passwordVerification"
          actionData={actionData}
        />

        <PasswordCheckView password={password} />
      </FormView>
    </PageFullContentWithLogo>
  );
}
