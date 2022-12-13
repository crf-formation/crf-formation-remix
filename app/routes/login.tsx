import { Box, Button, Link, TextField } from "@mui/material";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import PasswordCheckView from "~/components/hibp/PasswordCheckView";
import PageFullContentWithLogo from "~/components/layout/PageFullContentWithLogo";
import { USER_PASSWORD_MIN_LENGTH } from "~/constants";
import { createUserSession, getSession, getUserId } from "~/services/session.server";
import { validateUserEmail, verifyLogin } from "~/services/user.server";
import { createAuthenticityToken } from "~/utils/csrf.server";
import { safeRedirect } from "~/utils/routing";
// import { logger } from '~/services/logger';

export async function loader({ request }: LoaderArgs) {
  
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
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
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const defaultEmail = searchParams.get("email") || "test@crf-formation.fr" || ""; // TODO: fixture - remove

  const [email, setEmail] = useState(defaultEmail)

  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState("bonjour1"); // TODO: remove test password

  useEffect(() => {
    if (actionData?.errors?.email) {
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
            name="email"
            label="Email"
            variant="standard"
            margin="normal"
            type="email"
            autoComplete="email"
            autoFocus
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-describedby="email-form-error"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <FormErrorHelperText name="email" actionData={actionData} />

          <TextField
            name="password"
            label="Password"
            variant="standard"
            margin="normal"
            type="password"
            autoComplete="password"
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
            Log in
          </Button>
        </Box>

        <Box mt={3} textAlign="center">
          Forgot your password?{" "}
          <Link href={`/reset-password?${searchParams.toString()}&email=${email}`}>
            Reset it
          </Link>
        </Box>

      </Form>
    </PageFullContentWithLogo>
  );
}
