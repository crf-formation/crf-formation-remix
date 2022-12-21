import { Box, Button, Link, TextField } from "@mui/material";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useSearchParams } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import FormView from "~/components/form/FormView";
import PasswordCheckView from "~/components/hibp/PasswordCheckView";
import PageFullContentWithLogo from "~/components/layout/PageFullContentWithLogo";
import { USER_PASSWORD_MIN_LENGTH } from "~/constants";
import useFormFocusError from "~/hooks/useFormFocusError";
import { createUserSession, getSession, getUserId } from "~/services/session.server";
import { validateUserEmail, verifyLogin } from "~/services/user.server";
import { createAuthenticityToken } from "~/utils/csrf.server";
import { generateAria } from "~/utils/form";
import { getSearchParamsOrFail } from "~/utils/remix.params";
import { safeRedirect } from "~/utils/routing";

const URLSearchParamsSchema = z.object({
  redirectTo: z.string().default("/dashboard"),
  email: z.string().default("jon-doe@crf-formation.fr" || "" /* TODO: fixture - remove */),
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
  const formData = await request.formData();

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

  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/dashboard");
  const remember = formData.get("remember");

  if (!validateUserEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < USER_PASSWORD_MIN_LENGTH) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  }

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
    remember: remember === "on" ? true : false,
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
      <FormView
        action={
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Se connecter
          </Button>
        }
      >
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <TextField
          name="email"
          label="Email"
          variant="standard"
          margin="normal"
          type="email"
          autoComplete="email"
          autoFocus
          {...generateAria(actionData, "email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormErrorHelperText name="email" actionData={actionData} />

        <TextField
          name="password"
          label="Mot de passe"
          variant="standard"
          margin="normal"
          type="password"
          autoComplete="password"
          {...generateAria(actionData, "password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormErrorHelperText name="password" actionData={actionData} />
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
