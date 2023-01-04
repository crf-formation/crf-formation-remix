import { faker } from "@faker-js/faker";
import { Box, Link, TextField } from "@mui/material";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useSearchParams } from "@remix-run/react";
import { useRef } from "react";
import { z } from "zod";
import type { UserPostApiObject } from "~/apiobject/user.apiobject";
import FormErrorHelperText from "~/component/form/FormErrorHelperText";
import FormView from "~/component/form/FormView";
import PageFullContentWithLogo from "~/component/layout/PageFullContentWithLogo";
import type { UserPostDto } from "~/dto/user.dto";
import { validateForm } from "~/form/abstract";
import { joinValidator } from "~/form/user.form";
import useFormFocusError from "~/hooks/useFormFocusError";
import { userPostDtoToApiObject } from "~/mapper/user.mapper";
import { askForPasswordCreation } from "~/service/passwordrecovery.server";
import { getUserId } from "~/service/session.server";
import { createUser, findUserByEmail } from "~/service/user.server";
import { generateAria } from "~/util/form";
import { getSearchParamsOrFail } from "~/util/remix.params";
import { invalidFormResponse } from "~/util/responses";

const URLSearchParamsSchema = z.object({
  redirectTo: z.string().optional(),
});


export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");

  const { redirectTo } = getSearchParamsOrFail(request, URLSearchParamsSchema)

  return json({
    redirectTo
  });
}

export async function action({ request }: ActionArgs) {
  const result = await validateForm<UserPostDto>(request, joinValidator)

  if (result.errorResponse) {
    return result.errorResponse
  }

  // -- create dto
  const userPostDto: UserPostDto = result.data

  // -- check existing account with email
  const existingUser = await findUserByEmail(userPostDto.email);
  if (existingUser) {
    return invalidFormResponse({
      email: "A user already exists with this email",
    });
  }

  // -- map to api object
  const userPostApiObject: UserPostApiObject = userPostDtoToApiObject(userPostDto);

  // -- create user
  const user = await createUser(userPostApiObject);

  // -- create password token
  await askForPasswordCreation(user.id)
  
  return redirect("/create-password");
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Inscription",
  };
};

export default function JoinRoute() {
  const { redirectTo } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();

  const actionData = useActionData<typeof action>();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useFormFocusError(actionData, [
    [ "firstName", firstNameRef ],
    [ "lastName", lastNameRef ],
    [ "email", emailRef ],
  ]);

  const fakeFirstName = faker.name.firstName();
  const fakeLastName = faker.name.lastName();
  // TODO: only in development
  const fakeData = {
    firstName: fakeFirstName,
    lastName: fakeLastName,
    email: faker.internet.email(fakeFirstName, fakeLastName, "crf-formation.fr").toLocaleLowerCase()
  }

  return (
    <PageFullContentWithLogo>
      <FormView
        submitText="Créer le compte"
        validator={joinValidator}
      >
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <TextField
          name="firstName"
          ref={firstNameRef}
          label="Prénom"
          variant="standard"
          margin="normal"
          type="string"
          autoComplete="firstName"
          autoFocus
          {...generateAria(actionData, "firstName")}
          defaultValue={fakeData?.firstName}
        />
        <FormErrorHelperText name="firstName" actionData={actionData} />

        <TextField
          name="lastName"
          ref={lastNameRef}
          label="Nom"
          variant="standard"
          margin="normal"
          type="string"
          autoComplete="lastName"
          {...generateAria(actionData, "lastName")}
          defaultValue={fakeData?.lastName}
        />
        <FormErrorHelperText name="lastName" actionData={actionData} />

        <TextField
          name="email"
          ref={emailRef}
          label="Email"
          variant="standard"
          margin="normal"
          type="email"
          autoComplete="email"
          {...generateAria(actionData, "email")}
          defaultValue={fakeData?.email}
        />
        <FormErrorHelperText name="email" actionData={actionData} />
      </FormView>

      <Box mt={3} textAlign="center">
        Already have an account?{" "}
        <Link href={`/login?${searchParams.toString()}`}>Log in</Link>
      </Box>
    </PageFullContentWithLogo>
  );
}
