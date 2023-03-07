
export interface RecoverPasswordPropsDto {
  /**
   * Email of the User to change the password.
   */
  readonly email: string;
  /**
   * Token of the UserResetPasswordToken.
   */
  readonly token: string;
  /**
   * The new password to set to the User.
   */
  readonly password: string;
}

export interface AskPasswordRecoveryTokenPropsDto {
	readonly email: string;
}
