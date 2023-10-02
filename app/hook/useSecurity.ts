import type { AuthorityDtoEnum } from "~/dto/permission.dto";
import useOptionalUser from "./useOptionalUser";

export default function useSecurity() {
  const user = useOptionalUser();

  return {
    /**
     * @param authority one or more authority to check. We use an OR check on the given permissions.
     */
    hasAuthority: (...authority: AuthorityDtoEnum[]) => {
      if (!user) {
        return false;
      }
      return user.permissions.some((permission) =>
        authority.includes(permission.identifier)
      );
    },
  };
}
