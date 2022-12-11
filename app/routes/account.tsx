import Brightness2Icon from "@mui/icons-material/Brightness2";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
	Box,
	Button,
	Grid,
	IconButton,
	Tooltip,
	Typography
} from "@mui/material";
import { Form, useActionData, useLoaderData, useLocation } from "@remix-run/react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import PasswordForm from "~/components/account/PasswordForm";
import ProfileForm from "~/components/account/ProfileForm";
import Section from "~/components/layout/Section";
import useRootData from "~/hooks/useRootData";
import { updatePassword, validateUserEmail, verifyLogin, updateUser } from "~/services/user.server";
import { addFlashMessage } from "~/services/flash.server";
import { commitSession, getSession, requireAuth, requireUser } from '~/services/session.server';
import { verifyAuthenticityToken } from "~/utils/csrf.server";
import { badRequest } from "~/utils/responses";
import PageContainer from '../components/layout/PageContainer';

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "My account",
  };
};

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request)

  return json({
		user
	});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const session = await getSession(request);

  const formType = formData.get("formType");

  await verifyAuthenticityToken(formData, session);

	switch (formType) {
		case "password":
			return await actionPassword(request, formData)
		case "profile":
			return await actionProfile(request, formData)
	}

}

async function actionProfile(request: Request, formData: FormData) {
  const { userId } = await requireAuth(request)

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const phoneNumber = formData.get("phoneNumber");

  if (typeof firstName !== "string" || firstName.length === 0) {
    return badRequest({
      profile: { errors: { firstName: "First name required" }, },
    });
  }

  if (typeof lastName !== "string" || lastName.length === 0) {
    return badRequest({
      profile: { errors: { lastName: "Last name required" }, },
    });
  }

  if (!validateUserEmail(email)) {
    return badRequest({
      profile: { errors: { email: "Email is invalid" }, },
    });
  }

  await updateUser(userId, {
    firstName,
    lastName,
    email,
    phoneNumber
  });

	const session = await addFlashMessage(
		request,
		"success",
    `Your account has been updated`
  );

  return redirect("/account", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

async function actionPassword(request: Request, formData: FormData) {
  const user = await requireUser(request)

	const password = formData.get("password");
	const passwordVerification = formData.get("passwordVerification");
	const currentPassword = formData.get("currentPassword");

  if (typeof currentPassword !== "string" || currentPassword.length === 0) {
    return badRequest({
      password: { errors: { currentPassword: "Current password is required" } },
    });
  }

  const isPasswordCorrect = await verifyLogin(user.email, currentPassword);
  if (!isPasswordCorrect) {
    return badRequest({
      password: { errors: { currentPassword: "Invalid password" } },
    });
  }

  if (typeof password !== "string" || password.length === 0) {
    return badRequest({
      password: { errors: { password: "Password is required" } },
    });
  }
	
  if (password.length < 8) {
    return badRequest({
      password: { errors: { password: "Password is too short" } },
    });
  }

	if (typeof passwordVerification !== "string" || passwordVerification.length === 0) {
    return badRequest({
      password: {
        errors: { password: "Password verification is required" },
      },
    });
  }

	if (passwordVerification !== password) {
    return badRequest({
      password: {
        errors: { password: "Passwords does not match" },
      },
    });
  }
  
  await updatePassword(user.id, password);

	const session = await addFlashMessage(
		request,
		"success",
    `Your password has been updated`
  );

  return redirect("/account", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

function Theme() {
	const { themeName } = useRootData()

	const location = useLocation();

	return (
    <Section
			title="Theme"
		>
      <Form action="/" method="post">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <input
            type="hidden"
            name="redirectBack"
            value={`${location.pathname}${location.search}`}
          />
          <Tooltip title="Toggle theme">
            <IconButton type="submit" aria-label="Toggle theme">
              {themeName === "light" ? (
                <Brightness7Icon />
              ) : (
                <Brightness2Icon />
              )}
            </IconButton>
          </Tooltip>
          <Typography component="h1" variant="h6">
            Selected theme: {themeName}
          </Typography>
        </Box>
      </Form>
    </Section>
  );
}

function Logout() {
	return (
    <Section title="Logout">
      <Form
        action="/logout"
        method="post"
        style={{ width: "100%", textAlign: "center" }}
      >
        <Button
          type="submit"
          sx={{ width: "100%", maxWidth: 204 }}
          variant="outlined"
        >
          Logout
        </Button>
      </Form>
    </Section>
  );
}

function EditProfile() {
	const actionData = useActionData<typeof action>();
	const { user } = useLoaderData<typeof loader>();

	return (
		<Section title="Profile">
			<ProfileForm actionData={actionData?.profile} user={user} />
		</Section>
	)
}

function EditPassword() {
	const actionData = useActionData<typeof action>();
	const { user } = useLoaderData<typeof loader>();

	return (
		<Section title="Password">
			<PasswordForm actionData={actionData?.password} user={user} />
		</Section>
	)
}

export default function Index() {
	return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Grid>
            <EditProfile />
          </Grid>

          <Grid mt={2}>
            <EditPassword />
          </Grid>
        </Grid>

        <Grid item xs={3}>
          <Grid>
            <Theme />
          </Grid>

          <Grid mt={2}>
            <Logout />
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
