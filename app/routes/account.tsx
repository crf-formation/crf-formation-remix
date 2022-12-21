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
import type { Params} from "@remix-run/react";
import { Form, useActionData, useLoaderData, useLocation } from "@remix-run/react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import PasswordForm from "~/components/account/PasswordForm";
import ProfileForm from "~/components/account/ProfileForm";
import Section from "~/components/layout/Section";
import useRootData from "~/hooks/useRootData";
import { updatePassword, validateUserEmail, verifyLogin, updateUser } from "~/services/user.server";
import { addFlashMessage } from "~/services/flash.server";
import { commitSession, getSession, requireUser } from '~/services/session.server';
import { verifyAuthenticityToken } from "~/utils/csrf.server";
import { badRequest } from "~/utils/responses";
import PageContainer from '../components/layout/PageContainer';
import { getFormData } from "~/utils/remix.params";
import { namedActionWithFormType } from "~/utils/named-actions";
import { z } from "zod";
import type { UserPutDto } from "~/dto/user.dto";
import { userPutDtoToApiObject, userApiObjectToDto } from '../mapper/user.mapper';
import type { SecurityFunction } from "~/constants/remix";
import type { UserApiObject } from "~/apiobject/user.apiobject";

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "My account",
  };
};

export async function loader({ request, params }: LoaderArgs) {
  const { userApiObject } = await security(request, params)

  return json({
		user: userApiObjectToDto(userApiObject)
	});
}

export async function action({ request, params }: ActionArgs) {
  return namedActionWithFormType(request, params, {
		actionPassword,
    actionProfile,
	});
}

const security: SecurityFunction<{
  userApiObject: UserApiObject;
}> = async (request: Request, params: Params) => {
  const userApiObject = await requireUser(request)
  return {
    userApiObject,
  }
}

const ProfileSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
});

async function actionProfile(request: Request, params: Params) {
  const { userApiObject } = await security(request, params)

  let session = await getSession(request);
  await verifyAuthenticityToken(request, session);

  const result = await getFormData(request, ProfileSchema);
  if (!result.success) {
    return json(result, { status: 400 });
  }

  const userPutDto = result.data as UserPutDto

  if (!validateUserEmail(userPutDto.email)) {
    return badRequest({
      profile: { errors: { email: "Email is invalid" }, },
    });
  }

  await updateUser(userApiObject.id, userPutDtoToApiObject(userPutDto));

	session = await addFlashMessage(
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

const PasswordSchema = z.object({
	passwordVerification: z.string(),
	password: z.string(),
	currentPassword: z.string(),
});

async function actionPassword(request: Request, params: Params) {
  const { userApiObject } = await security(request, params)

  let session = await getSession(request);
  await verifyAuthenticityToken(request, session);

  const result = await getFormData(request, PasswordSchema);
  if (!result.success) {
    return json(result, { status: 400 });
  }

  const userPasswordPutDto = result.data // TODO: as Dto

	const password = userPasswordPutDto.password;
	const passwordVerification = userPasswordPutDto.passwordVerification;
	const currentPassword = userPasswordPutDto.currentPassword;

  if (typeof currentPassword !== "string" || currentPassword.length === 0) {
    return badRequest({
      password: { errors: { currentPassword: "Current password is required" } },
    });
  }

  const isPasswordCorrect = await verifyLogin(userApiObject.email, currentPassword);
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
  
  await updatePassword(userApiObject.id, password);

	session = await addFlashMessage(
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

export default function AccountRoute() {
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
