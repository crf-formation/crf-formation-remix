import { Box, Link } from "@mui/material";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useSearchParams } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";
import FormTextField from "~/component/form/FormTextField";
import FormView from "~/component/form/FormView";
import PasswordCheckView from "~/component/hibp/PasswordCheckView";
import PageFullContentWithLogo from "~/component/layout/PageFullContentWithLogo";
import type { LoginDto } from "~/dto/login.dto";
import { validateForm } from "~/form/abstract";
import { loginValidator } from "~/form/login.form";
import { getSearchParamsOrFail } from "~/helper/remix.params.helper";
import { invalidFormResponse } from "~/helper/responses.helper";
import useFormFocusError from "~/hook/useFormFocusError";
import { createUserSession, getSession, getUserId } from "~/service/session.server";
import { verifyLogin } from "~/service/user.server";
import { createAuthenticityToken } from "~/util/csrf.server";

const URLSearchParamsSchema = z.object({
  redirectTo: z.string().default("/dashboard"),
  email: z.string().default("jon-doe@crf-formation.fr"), // TODO: remove
});

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  
  const { redirectTo, email: defaultEmail } = getSearchParamsOrFail(request, URLSearchParamsSchema)

  return json({
    redirectTo,
    defaultEmail
  });
}

export async function action({ request }: ActionArgs) {
  const session = await getSession(request);

  // logger.info('onAction: ' + session.get('csrf'))

  // https://security.stackexchange.com/questions/22903/why-refresh-csrf-token-per-form-request
  // it is not necessary to generate a new token per request. It brings almost zero security advantage,
  // and it costs you in terms of usability: with only one token valid at once, the user will not be able to navigate the webapp normally.
  // For example if they hit the 'back' button and submit the form with new values, the submission will fail, and likely greet them with some
  // hostile error message. If they try to open a resource in a second tab, they'll find the session randomly breaks in one or both tabs.
  // It is usually not worth maiming your application's usability to satisfy this pointless requirement.
  // There is one place where it is worth issuing a new CSRF token, though: on principal-change inside a session.
  // That is, primarily, at login. This is to prevent a session fixation attack leading to a CSRF attack possibility.
  // TODO: make it on join too?
  createAuthenticityToken(session); // csrf: generate token

  const result = await validateForm<LoginDto>(request, loginValidator);

  if (result.errorResponse) {
    return result.errorResponse
  }

  const { email, password, redirectTo, remember, } = result.data


  const userAuthToken = await verifyLogin(email, password);
  if (!userAuthToken) {
    return invalidFormResponse(
      { email: "Email ou mot de passe invalide" }
    );
  }

  return createUserSession({
    session,
    userId: userAuthToken.user.id,
    remember,
    redirectTo,
  });

}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Login",
  };
};

export default function LoginRoute() {
  const { redirectTo, defaultEmail } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState("bonjour1"); // TODO: remove test password

  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  useFormFocusError(actionData, [
    [ "email", emailRef ],
    [ "password", passwordRef ],
  ]);

  return (
    <PageFullContentWithLogo>
      <FormView submitText="Se connecter" validator={loginValidator}>
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <FormTextField
          name="email"
          label="Email"
          variant="standard"
          margin="normal"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormTextField
          name="password"
          label="Mot de passe"
          variant="standard"
          margin="normal"
          type="password"
          autoComplete="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordCheckView password={password} />
      </FormView>

      <Box mt={3} textAlign="center">
        Forgot your password?{" "}
        <Link
          href={`/reset-password?${searchParams.toString()}&email=${email}`}
        >
          Reset it
        </Link>
      </Box>
    </PageFullContentWithLogo>
  );
}
