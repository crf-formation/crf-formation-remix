import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { USER_PASSWORD_MIN_LENGTH } from "~/constant";

export const LoginSchema = z.object({
	email: z.string().email("L'email est invalide"),
	password: z.string()
		.min(USER_PASSWORD_MIN_LENGTH, `Le mot de passe doit faire au moins ${USER_PASSWORD_MIN_LENGTH} caractères`),
	redirectTo: z.string(),
	remember: z.boolean().default(true),
});

export const loginValidator = withZod(LoginSchema)
