import type { Void } from "~/constants/types";
import type { AskPasswordRecoveryTokenPropsDto, RecoverPasswordPropsDto } from "~/dto/passwordrecovery.dto";

export async function askForPasswordRecovery(
  email: string
) {
  return null
}

export async function recoverPassword(
  // RecoverPasswordPropsDto
  email: string,
  token: string,
  password: string
) {
	return null
}

export async function createPassword(
  email: string,
  token: string,
  password: string
) {
	return null
}
