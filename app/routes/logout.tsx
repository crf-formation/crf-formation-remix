import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { Params } from "react-router";
import type { SecurityFunction } from "~/constant/remix";

import { logout } from "~/service/session.server";

const security: SecurityFunction<void> = async (request: Request, params: Params) => {
}

export async function loader({ request, params }: LoaderArgs) {
  await security(request, params)
  return redirect("/");
}

export async function action({ request, params }: ActionArgs) {
  await security(request, params)
  console.log('-=---------------------->')
  return logout(request);
}

