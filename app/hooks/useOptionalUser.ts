import type { ProUserMeDto } from "~/dto/prouser.dto";
import useRootData from "./useRootData";

function isUser(user: any): user is ProUserMeDto {
  return user && typeof user === "object" && typeof user.email === "string";
}

export default function useOptionalUser(): ProUserMeDto | undefined {
  const data = useRootData();
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

