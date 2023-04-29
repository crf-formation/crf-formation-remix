import type { Params } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import type { SecurityFunction } from "~/helper/remix.helper";
import { requireUser } from "~/service/session.server";
import { userApiObjectToDto } from "~/mapper/user.mapper";
import type { V2_MetaFunction } from "@remix-run/node";

const security: SecurityFunction<{
  userApiObject: UserApiObject;
}> = async (request: Request, params: Params) => {
  const userApiObject = await requireUser(request);
  return {
    userApiObject
  };
};


export async function loader({ request, params }: LoaderArgs) {
  const { userApiObject } = await security(request, params);

  return json({
    user: userApiObjectToDto(userApiObject)
  });
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: "Dashboard" }
  ];
};


export default function DashboardRoute() {
  return (
    <></>
  );
}
