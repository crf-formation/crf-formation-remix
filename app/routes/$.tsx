//
// 404 page (fallback route)
//
import type { LoaderArgs, V2_MetaFunction  } from "@remix-run/node";
import { json } from "@remix-run/node";
import { DefaultErrorView } from "~/component/layout/ErrorPageContainer";

export async function loader({ request }: LoaderArgs) {
  return json({})
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: "404 - Page inconnue" },
  ];
};

export default function NotFoundRoute() {
  return (
    <DefaultErrorView
      title={`404 - Page inconnue`}
      defaultMessage={
        <p>Oops! La page demandée n'a pas été trouvée.</p>
      }
    />
  );
}
