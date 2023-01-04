//
// 404 page (fallback route)
//
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import ErrorPageContainer from "~/component/layout/ErrorPageContainer";

export async function loader({ request }: LoaderArgs) {
  return json({})
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "404 - Page inconnue",
  };
};


export default function NotFoundRoute() {
  return (
    <ErrorPageContainer
      title={`404 - Page inconnue`}
      message={
        <p>Oops! La page demandée n'a pas été trouvée.</p>
      }
    />
  );
}
