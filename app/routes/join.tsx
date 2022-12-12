import { Box, Button, Link, TextField } from "@mui/material";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { isEmpty } from "lodash";
import { useEffect, useRef } from "react";
import { createUser, findUserByEmail, validateUserEmail } from "~/services/user.server";
import { getUserId } from "~/services/session.server";
import { badRequest } from "~/utils/responses";
import FormErrorHelperText from "~/components/form/FormErrorHelperText";
import PageFullContentWithLogo from "~/components/layout/PageFullContentWithLogo";
import type { UserPostDto } from "~/dto/user.dto";
import type { UserPostApiObject } from "~/apiobject/user.apiobject";
import { userPostDtoToUserPostApiObject } from "~/mapper/user.mapper";
import { askForPasswordCreation } from "~/services/passwordrecovery.server";
import { faker } from "@faker-js/faker";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
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
  const userPostApiObject: UserPostApiObject = userPostDtoToUserPostApiObject(userPostDto);

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
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.firstName) {
      firstNameRef.current?.focus();
    } else if (actionData?.errors?.lastName) {
      lastNameRef.current?.focus();
    } else if (actionData?.errors?.email) {
      emailRef.current?.focus();
    }
  }, [actionData]);

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
      <Form method="post">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            name="firstName"
            ref={firstNameRef}
            label="First name"
            variant="standard"
            margin="normal"
            type="string"
            autoComplete="firstName"
            autoFocus
            aria-invalid={actionData?.errors?.firstName ? true : undefined}
            aria-describedby="firstName-form-error"
            defaultValue={fakeData?.firstName}
          />
          <FormErrorHelperText name="firstName" actionData={actionData} />

          <TextField
            name="lastName"
            ref={lastNameRef}
            label="Last name"
            variant="standard"
            margin="normal"
            type="string"
            autoComplete="lastName"
            aria-invalid={actionData?.errors?.lastName ? true : undefined}
            aria-describedby="lastName-form-error"
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
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-describedby="email-form-error"
            defaultValue={fakeData?.email}
          />
          <FormErrorHelperText name="email" actionData={actionData} />

        </Box>

        <Box sx={{ marginTop: 2, display: "flex", justifyContent: "end" }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create account
          </Button>
        </Box>

        <Box mt={3} textAlign="center">
          Already have an account?{" "}
          <Link href={`/login?${searchParams.toString()}`}>Log in</Link>
        </Box>
      </Form>
    </PageFullContentWithLogo>
  );
}
