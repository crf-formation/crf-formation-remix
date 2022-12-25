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
import type { PasswordResetDto } from "~/dto/user.dto";
import { validateForm } from '~/form/abstract';
import { passwordResetValidator } from "~/form/user.form";
import useFormFocusError from "~/hooks/useFormFocusError";
import type { ApiErrorException } from '~/services/api.error';
import { addFlashMessage } from "~/services/flash.server";
import { recoverPassword } from "~/services/passwordrecovery.server";
import { commitSession, getSession, getUserId } from "~/services/session.server";
import { getParamsOrFail, getSearchParamsOrFail } from "~/utils/remix.params";
import { invalidFormResponse } from "~/utils/responses";
import { badRequestWithFlash } from "~/utils/responsesError";

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
	const { token } = getParamsOrFail(params, ParamsSchema)

  const result = await validateForm<PasswordResetDto>(request, passwordResetValidator)
  if (result.errorResponse) {
    return result.errorResponse
  }

  const passwordResetDto: PasswordResetDto = result.data
	if (passwordResetDto.passwordVerification !== passwordResetDto.password) {
    return invalidFormResponse({
        passwordVerification: "Les mots de passes ne correspondent pas"
    });
  }

  try { 
    await recoverPassword(passwordResetDto.email, token, passwordResetDto.password)
  } catch (e) {
    return badRequestWithFlash(session, e as ApiErrorException)
  }

	session = await addFlashMessage(
		request,
		"success",
    `Your password has been updated`
  );

  return redirect(`/login?email=${passwordResetDto.email}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Modification du mot de passe",
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
        />

        <PasswordCheckView password={password} />
      </FormView>
    </PageFullContentWithLogo>
  );
}
