import { Box, Button, Link, TextField, Typography } from "@mui/material";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import PageFullContentWithLogo from "~/components/layout/PageFullContentWithLogo";
import { askForPasswordRecovery } from "~/services/passwordrecovery.server";
import { validateUserEmail } from "~/services/user.server";
import { getSession, getUserId } from "~/services/session.server";
import { badRequest } from '../../utils/responses';

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  await getSession(request);
  const formData = await request.formData();

  const email = formData.get('email')

  if (!validateUserEmail(email)) {
    throw badRequest(
      { errors: { email: "Invalid email"}}
    )
  }

  await askForPasswordRecovery(email as string);

  return redirect("/reset-password/sent")
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Password fogotten",
  };
};

export default function PasswordResetRoute() {
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const defaultEmail = searchParams.get("email") || "";

  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    }   
  }, [actionData]);

  return (
    <PageFullContentWithLogo>

      <Box sx={{ textAlign: "center", mt: 2, }}>
        <Typography variant="h5">
          Reset your password
        </Typography>
        
        <Typography variant="subtitle1" sx={{ md: 2, maxWidth: 300, mt: 3 }}>
          Enter your email address and we will send you a password reset link.
        </Typography>
      </Box>

      <Form method="post">

        <input type="hidden" name="redirectTo" value={redirectTo} />

        <Box sx={{ display: "flex", flexDirection: "column", mt: 2, }}>
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            margin="normal"
            autoFocus
            type="email"
            autoComplete="email"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-describedby="email-form-error"
            defaultValue={defaultEmail}
          />
          <FormErrorHelperText name="email" actionData={actionData} />

        </Box>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "end" }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Box>

        <Box mt={3} textAlign="center">
          <Link href={`/login?${searchParams.toString()}`}>Return to log in</Link>
        </Box>
      </Form>
    </PageFullContentWithLogo>
  );
}
