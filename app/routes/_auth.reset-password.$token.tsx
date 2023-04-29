import { Box, Typography } from "@mui/material";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";
import FormTextField from "~/component/form/FormTextField";
import FormView from "~/component/form/FormView";
import PasswordCheckView from "~/component/hibp/PasswordCheckView";
import PageFullContentWithLogo from "~/component/layout/PageFullContentWithLogo";
import type { PasswordResetDto } from "~/dto/user.dto";
import { validateForm } from '~/form/abstract';
import { passwordResetValidator } from "~/form/user.form";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail, getSearchParamsOrFail } from "~/helper/remix.params.helper";
import { badRequestWithFlash } from "~/helper/responseerror.helper";
import { invalidFormResponse } from "~/helper/responses.helper";
import useFormFocusError from "~/hook/useFormFocusError";
import type { ApiErrorException } from '~/service/api.error';
import { addFlashMessage } from "~/service/flash.server";
import { recoverPassword } from "~/service/passwordrecovery.server";
import { commitSession, getSession, getUserId } from "~/service/session.server";

const ParamsSchema = z.object({
  token: z.string(),
});

const URLSearchParamsSchema = z.object({
  email: z.string()
});

const security: SecurityFunction<{
  token: string;
}> = async (request: Request, params: Params) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");

	const { token } = getParamsOrFail(params, ParamsSchema)
  return {
    token
  }
}

export async function loader({ request, params }: LoaderArgs) {
  await security(request, params);

  const { email } = getSearchParamsOrFail(request, URLSearchParamsSchema);

  return json({
    email
  });
}

export async function action({ request, params }: ActionArgs) {
  const { token } = await security(request, params);

  let session = await getSession(request);

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

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: "Modification du mot de passe" },
  ];
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
