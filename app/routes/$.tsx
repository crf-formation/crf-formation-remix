//
// 404 page (fallback route)
//
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import ErrorPageContainer from "~/components/layout/ErrorPageContainer";

export async function loader({ request }: LoaderArgs) {
  return json({})
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "404 - not found",
  };
};


export default function Dashboard() {
  return (
    <ErrorPageContainer
      title={`404 - not found`}
      message={
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      }
    />
  );
}
