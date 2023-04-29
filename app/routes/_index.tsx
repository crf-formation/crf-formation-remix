import type { LoaderArgs } from "@remix-run/node";
import { redirect, V2_MetaFunction } from "@remix-run/node";
import { requireUser } from "~/service/session.server";

// nothing yet on index redirect:
// - loggedout: to login page
// - loggedin: to dashboard
export async function loader({ request }: LoaderArgs) {
  await requireUser(request);

  return redirect("/dashboard");
  // return json({});
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: "CRF formation" }
  ];
};

export default function IndexRoute() {
  return <main></main>;
}
