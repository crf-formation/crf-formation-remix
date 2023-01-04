import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUser } from "~/service/session.server";

// nothing yet on index redirect:
// - loggedout: to login page
// - loggedin: to dashboard
export async function loader({ request }: LoaderArgs) {
  await requireUser(request);

  return redirect("/dashboard")
  // return json({});
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Backoffice",
  };
};

export default function IndexRoute() {
  return <main></main>;
}
