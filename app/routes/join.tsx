import { faker } from "@faker-js/faker";
import { Box, Button, Link, TextField } from "@mui/material";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useSearchParams } from "@remix-run/react";
import { isEmpty } from "lodash";
import { useRef } from "react";
import { z } from "zod";
import type { UserPostApiObject } from "~/apiobject/user.apiobject";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import FormView from "~/components/form/FormView";
import PageFullContentWithLogo from "~/components/layout/PageFullContentWithLogo";
import type { UserPostDto } from "~/dto/user.dto";
import useFormFocusError from "~/hooks/useFormFocusError";
import { userPostDtoToApiObject } from "~/mapper/user.mapper";
import { askForPasswordCreation } from "~/services/passwordrecovery.server";
import { getUserId } from "~/services/session.server";
import { createUser, findUserByEmail, validateUserEmail } from "~/services/user.server";
import { generateAria } from "~/utils/form";
import { getSearchParamsOrFail } from "~/utils/remix.params";
import { badRequest } from "~/utils/responses";

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
  const formData = await request.formData();

  // -- extract form data
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  // const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  // -- data validation
  if (isEmpty(firstName)) {
    return badRequest({
      errors: { email: "Prénom requis" },
    });
  }

  if (isEmpty(lastName)) {
    return badRequest({
      errors: { email: "Nom requis"},
    });
  }

  if (!validateUserEmail(email)) {
    return badRequest({
      errors: { email: "Email invalide" },
    });
  }

  // -- create dto
  const userPostDto: UserPostDto = {
    firstName: firstName as string,
    lastName: lastName as string,
    email
  }

  // -- check existing account with email
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 }
    );
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
