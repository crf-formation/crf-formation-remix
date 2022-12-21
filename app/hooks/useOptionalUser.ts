import type { UserMeDto } from "~/dto/user.dto";
import useRootData from "./useRootData";

function isUser(user: any): user is UserMeDto {
  return user && typeof user === "object" && typeof user.email === "string";
}

export default function useOptionalUser(): UserMeDto | undefined {
  const data = useRootData();
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

