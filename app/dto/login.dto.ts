

export interface LoginDto {
	readonly email: string;
	readonly password: string;
	readonly remember: boolean;
	readonly redirectTo: string;
}