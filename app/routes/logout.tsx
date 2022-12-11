import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "~/services/session.server";

export async function action({ request }: ActionArgs) {
  console.log('-=---------------------->')
  return logout(request);
}

export async function loader() {
  return redirect("/");
}
