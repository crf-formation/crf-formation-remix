import type { UserMeDto } from "~/dto/user.dto";
import useOptionalUser from "./useOptionalUser";

export default function useUser(): UserMeDto {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}
