import { Box, Typography } from "@mui/material";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect,  } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";
import FormTextField from "~/component/form/FormTextField";
import FormView from "~/component/form/FormView";
import PasswordCheckView from "~/component/hibp/PasswordCheckView";
import PageFullContentWithLogo from "~/component/layout/PageFullContentWithLogo";
import type { PasswordCreateDto } from "~/dto/user.dto";
import { validateForm } from "~/form/abstract";
import { passwordCreateValidator } from "~/form/user.form";
import { getParamsOrFail, getSearchParamsOrFail } from "~/helper/remix.params.helper";
import { badRequestWithFlash } from "~/helper/responseerror.helper";
import { invalidFormResponse } from "~/helper/responses.helper";
import useFormFocusError from "~/hook/useFormFocusError";
import { createPassword, verifyTokenIsValid } from "~/service/passwordrecovery.server";
import { createUserSession, getSession, getUserId } from "~/service/session.server";
import { verifyLogin } from "~/service/user.server";

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

	const { token } = getParamsOrFail(params, ParamsSchema)

  const result = await validateForm<PasswordCreateDto>(request, passwordCreateValidator)
  if (result.errorResponse) {
    return result.errorResponse
  }

  const passwordCreateDto: PasswordCreateDto = result.data

	if (passwordCreateDto.passwordVerification !== passwordCreateDto.password) {
    return invalidFormResponse({
      passwordVerification: "Les mots de passes ne correspondent pas"
    });
  }
	
  try { 
    await createPassword(passwordCreateDto.email, token, passwordCreateDto.password)
  } catch (e) {
    return badRequestWithFlash(session, e)
  }

  // password has been created, automatically login

  const userAuthToken = await verifyLogin(passwordCreateDto.email, passwordCreateDto.password);

  if (!userAuthToken) {
    return invalidFormResponse({
      passwordVerification: "Email ou mot de passe invalide"
    });
  }

  return createUserSession({
    session,
    userId: userAuthToken.user.id,
    remember: true,
    redirectTo: "/welcome",
  });
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: "Finalisation de la création du compte" },
  ];
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
        validator={passwordCreateValidator}
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
