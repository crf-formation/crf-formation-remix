
export interface RecoverPasswordPropsDto {
	/**
   * Email of the User to change the password.
   */
	 email: string;
	 /**
		* Token of the UserResetPasswordToken.
		*/
	 token: string;
	 /**
		* The new password to set to the User.
		*/
	 password: string;
}

export interface AskPasswordRecoveryTokenPropsDto {
	email: string;
}
