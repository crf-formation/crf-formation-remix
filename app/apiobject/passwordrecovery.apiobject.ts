export interface UserPasswordTokenApiObject {
	userId: string;
	token: string;
	tokenExpirationDate: Date;
}