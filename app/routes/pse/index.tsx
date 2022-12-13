import { Link } from "@mui/material";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import invariant from "tiny-invariant";
import PageContainer from "~/components/layout/PageContainer";
import type { OrderByDirection } from "~/constants/types";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getUserPseFormations } from "~/services/pseformation.server";
import { getSearchParam, getSearchParamNumber } from "~/services/request.server";
import { requireUser } from '~/services/session.server';

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);

  const page = getSearchParamNumber(request, 'page') || 0
	const pageSize = getSearchParamNumber(request, 'pageSize') || 25

	const orderBy = getSearchParam(request, 'orderBy')  || "from"
	const orderByDirection = (getSearchParam(request, 'orderByDirection') || "desc") as OrderByDirection

	invariant(orderBy, `Missing orderBy`)
	invariant(orderByDirection, `Missing orderByDirection`)

  const formationsPaginatedObjectApiObject = await getUserPseFormations(user.id, page, pageSize, orderBy, orderByDirection)

  return json({
    formations: paginateEntityToApiObject(formationsPaginatedObjectApiObject, pseFormationApiObjectToDto)
  });
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Mes formations PSE",
  };
};

export default function FromationPseRoute() {
  const { formations } = useLoaderData<typeof loader>();

  return (
    <PageContainer>

      {formations.data.map(formation => (
        <div key={formation.id}>
          <Link href={`/pse/${formation.id}`}>
            {formation.title} {formation.place.title}
          </Link>
        </div>
      ))}

    </PageContainer>
  );
}
