import type { LoaderArgs , V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireLoggedInRequestContext } from "~/service/session.server";

// nothing yet on index redirect:
// - loggedout: to login page
// - loggedin: to dashboard
export async function loader({ request }: LoaderArgs) {
  await requireLoggedInRequestContext(request);

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
