import Brightness2Icon from "@mui/icons-material/Brightness2";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
	Box,
	Button,
	Grid,
	IconButton,
	Tooltip,
	Typography,
} from "@mui/material";
import type { Params } from "@remix-run/react";
import {
	Form,
	useActionData,
	useLoaderData,
	useLocation,
} from "@remix-run/react";
import type {
	ActionArgs,
	LoaderArgs,
	MetaFunction,
} from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import PasswordForm from "~/component/account/PasswordForm";
import ProfileForm from "~/component/account/ProfileForm";
import Section from "~/component/layout/Section";
import type { UserPasswordPutDto, UserPutDto } from "~/dto/user.dto";
import { validateForm } from '~/form/abstract';
import type { SecurityFunction } from "~/helper/remix";
import { badRequest } from "~/helper/responses.helper";
import useRootData from "~/hook/useRootData";
import { addFlashMessage } from "~/service/flash.server";
import {
	commitSession,
	getSession,
	requireUser,
} from "~/service/session.server";
import {
	updatePassword,
	updateUser,
	verifyLogin,
} from "~/service/user.server";
import { verifyAuthenticityToken } from "~/util/csrf.server";
import { namedActionWithFormType } from "~/util/named-actions";
import PageContainer from "../component/layout/PageContainer";
import { passwordModificationValidator, profileValidator } from '../form/user.form';
import {
	userApiObjectToDto,
	userPutDtoToApiObject,
} from "../mapper/user.mapper";

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "My account",
  };
};

const security: SecurityFunction<{
  userApiObject: UserApiObject;
}> = async (request: Request, params: Params) => {
  const userApiObject = await requireUser(request);
  return {
    userApiObject,
  };
};


export async function loader({ request, params }: LoaderArgs) {
  const { userApiObject } = await security(request, params);

  return json({
    user: userApiObjectToDto(userApiObject),
  });
}

export async function action({ request, params }: ActionArgs) {
  return namedActionWithFormType(request, params, {
    actionPassword,
    actionProfile,
  });
}

async function actionProfile(request: Request, params: Params) {
  const { userApiObject } = await security(request, params);

  let session = await getSession(request);
  await verifyAuthenticityToken(request, session);

  const result = await validateForm<UserPutDto>(request, profileValidator);
  if (result.errorResponse) {
    return result.errorResponse
  }

  const userPutDto = result.data

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

async function actionPassword(request: Request, params: Params) {
  const { userApiObject } = await security(request, params);

  let session = await getSession(request);
  await verifyAuthenticityToken(request, session);

  const result = await validateForm<UserPasswordPutDto>(request, passwordModificationValidator);
  if (result.errorResponse) {
    return result.errorResponse
  }

  const userPasswordPutDto = result.data;

  const password = userPasswordPutDto.password;
  const passwordVerification = userPasswordPutDto.passwordVerification;
  const currentPassword = userPasswordPutDto.currentPassword;

  const isPasswordCorrect = await verifyLogin(
    userApiObject.email,
    currentPassword
  );
  if (!isPasswordCorrect) {
    return badRequest({
      password: { fieldErrors: { currentPassword: "Invalid password" } },
    });
  }

  if (passwordVerification !== password) {
    return badRequest({
      password: {
        fieldErrors: { password: "Les mots de passes ne correspondent pas" },
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
  const { themeName } = useRootData();

  const location = useLocation();

  return (
    <Section title="Theme">
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
    <Section title="Deconnexion">
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
          Deconnexion
        </Button>
      </Form>
    </Section>
  );
}

function EditProfile() {
  const actionData = useActionData<typeof action>();
  const { user } = useLoaderData<typeof loader>();

  return (
    <Section title="Profil">
      <ProfileForm actionData={actionData?.profile} user={user} />
    </Section>
  );
}

function EditPassword() {
  const actionData = useActionData<typeof action>();

  return (
    <Section title="Mot de passe">
      <PasswordForm actionData={actionData?.password} />
    </Section>
  );
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
