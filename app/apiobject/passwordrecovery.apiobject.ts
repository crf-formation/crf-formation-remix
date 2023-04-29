export interface UserPasswordTokenApiObject {
  readonly userId: string;
  readonly token: string;
  readonly tokenExpirationDate: Date;
}