import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { USER_PASSWORD_MIN_LENGTH } from "~/constants";

//
// join
//

export const JoinSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().min(1),
});

export const joinValidator = withZod(JoinSchema);


//
// Profile edit
//

export const ProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().min(1),
});

export const profileValidator = withZod(ProfileSchema);


//
// Password modification
//

const PasswordModificationSchema = z.object({
  passwordVerification: z
    .string()
    .min(
      USER_PASSWORD_MIN_LENGTH,
      `Le mot de passe doit faire au moins ${USER_PASSWORD_MIN_LENGTH} caractères`
    ),
  password: z
    .string()
    .min(
      USER_PASSWORD_MIN_LENGTH,
      `Le mot de passe doit faire au moins ${USER_PASSWORD_MIN_LENGTH} caractères`
    ),
  currentPassword: z
    .string()
    .min(
      USER_PASSWORD_MIN_LENGTH,
      `Le mot de passe doit faire au moins ${USER_PASSWORD_MIN_LENGTH} caractères`
    ),
});

export const passwordModificationValidator = withZod(
  PasswordModificationSchema
);

//
//
//


const PasswordCreateSchema = z.object({
  passwordVerification: z
    .string()
    .min(
      USER_PASSWORD_MIN_LENGTH,
      `Le mot de passe doit faire au moins ${USER_PASSWORD_MIN_LENGTH} caractères`
    ),
  password: z
    .string()
    .min(
      USER_PASSWORD_MIN_LENGTH,
      `Le mot de passe doit faire au moins ${USER_PASSWORD_MIN_LENGTH} caractères`
    ),
});

export const passwordCreateValidator = withZod(PasswordCreateSchema)

//
//
//


const PasswordResetSchema = z.object({
  passwordVerification: z
    .string()
    .min(
      USER_PASSWORD_MIN_LENGTH,
      `Le mot de passe doit faire au moins ${USER_PASSWORD_MIN_LENGTH} caractères`
    ),
  password: z
    .string()
    .min(
      USER_PASSWORD_MIN_LENGTH,
      `Le mot de passe doit faire au moins ${USER_PASSWORD_MIN_LENGTH} caractères`
    ),
});

export const passwordResetValidator = withZod(PasswordResetSchema)

//
//
//


const PasswordAskResetSchema = z.object({
  email: z.string().email().min(1),

});

export const passwordAskResetValidator = withZod(PasswordAskResetSchema)