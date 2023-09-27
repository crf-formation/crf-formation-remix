import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect, V2_MetaFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useSearchParams } from "@remix-run/react";
import { useRef } from "react";
import { z } from "zod";
import FormErrorHelperText from "~/component/form/FormErrorHelperText";
import FormView from "~/component/form/FormView";
import PageFullContentWithLogo from "~/component/layout/PageFullContentWithLogo";
import type { PasswordAskResetDto } from "~/dto/user.dto";
import { validateForm } from "~/form/abstract";
import { passwordAskResetValidator } from "~/form/user.form";
import { getSearchParamsOrFail } from "~/helper/remix.params.helper";
import useFormFocusError from "~/hook/useFormFocusError";
import { askForPasswordRecovery } from "~/service/passwordrecovery.server";
import { getSession, getUserId } from "~/service/session.server";
import { generateAria } from "~/util/form";

const URLSearchParamsSchema = z.object({
  email: z.string().optional(),
  redirectTo: z.string().default("/dashboard")
});


export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");

  const { email: defaultEmail, redirectTo } = getSearchParamsOrFail(request, URLSearchParamsSchema);

  return json({
    redirectTo,
    defaultEmail
  });
}

export async function action({ request }: ActionArgs) {
  await getSession(request);

  const result = await validateForm<PasswordAskResetDto>(request, passwordAskResetValidator);
  if (result.errorResponse) {
    return result.errorResponse;
  }

  const passwordAskResetDto: PasswordAskResetDto = result.data;
  await askForPasswordRecovery(passwordAskResetDto.email);

  return redirect("/reset-password/sent");
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: "Mot de passe oublié" }
  ];
};

export default function PasswordResetRoute() {
  const { redirectTo, defaultEmail } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [searchParams] = useSearchParams();

  const emailRef = useRef<HTMLInputElement>(null);
  useFormFocusError(actionData, [
    ["email", emailRef]
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
        validator={passwordAskResetValidator}
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
