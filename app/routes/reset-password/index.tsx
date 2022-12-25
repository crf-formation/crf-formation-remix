import { Box, Button, Link, TextField, Typography } from "@mui/material";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useSearchParams } from "@remix-run/react";
import { useRef } from "react";
import { z } from "zod";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import PageFullContentWithLogo from "~/components/layout/PageFullContentWithLogo";
import { askForPasswordRecovery } from "~/services/passwordrecovery.server";
import { getSession, getUserId } from "~/services/session.server";
import { validateUserEmail } from "~/services/user.server";
import { getSearchParamsOrFail } from "~/utils/remix.params";
import { badRequest } from '../../utils/responses';
import useFormFocusError from "~/hooks/useFormFocusError";
import FormView from "~/components/form/FormView";
import { generateAria } from "~/utils/form";

const URLSearchParamsSchema = z.object({
  email: z.string(),
  redirectTo: z.string().default("/dashboard"),
});


export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");

  const { email: defaultEmail, redirectTo } = getSearchParamsOrFail(request, URLSearchParamsSchema);

  return json({
    redirectTo, 
    defaultEmail,
  });
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
  const { redirectTo, defaultEmail } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [searchParams] = useSearchParams();

  const emailRef = useRef<HTMLInputElement>(null);

  useFormFocusError(actionData, [
    ["email", emailRef],
  ]);

  return (
    <PageFullContentWithLogo>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="h5">Reset your password</Typography>

        <Typography variant="subtitle1" sx={{ md: 2, maxWidth: 300, mt: 3 }}>
          Enter your email address and we will send you a password reset link.
        </Typography>
      </Box>

      <FormView
        submitText="Réinitialiser"
      >
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <TextField
          name="email"
          label="Email"
          variant="outlined"
          margin="normal"
          autoFocus
          type="email"
          autoComplete="email"
          {...generateAria(actionData, "email")}
          defaultValue={defaultEmail}
        />
        <FormErrorHelperText name="email" actionData={actionData} />
      </FormView>

      <Box mt={3} textAlign="center">
        <Link href={`/login?${searchParams.toString()}`}>Return to log in</Link>
      </Box>
    </PageFullContentWithLogo>
  );
}
