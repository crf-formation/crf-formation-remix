import { Link, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params} from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';
import { z } from "zod";
import PageContainer from "~/components/layout/PageContainer";
import type { SecurityFunction } from "~/constants/remix";
import { paginateApiObjectToDto } from "~/mapper/abstract.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getUserPseFormations } from "~/services/pseformation.server";
import { requireUser } from '~/services/session.server';
import { getSearchParamsOrFail } from "~/utils/remix.params";

const URLSearchParamsSchema = z.object({
  page: z.number().default(0),
  pageSize: z.number().default(25),
	orderBy: z.string().default("createdAt"),
	orderByDirection: z.enum([ 'asc', 'desc']).default("desc"),
})

export async function loader({ request }: LoaderArgs) {
  const { userApiObject } = await security(request, params)


	const { page, pageSize, orderBy, orderByDirection } = getSearchParamsOrFail(request, URLSearchParamsSchema)


  const formationsPaginatedObjectApiObject = await getUserPseFormations(userApiObject.id, page, pageSize, orderBy, orderByDirection)

  return json({
    formationsPaginateObject: paginateApiObjectToDto(formationsPaginatedObjectApiObject, pseFormationApiObjectToDto)
  });
}

const security: SecurityFunction<{
  userApiObject: UserApiObjectApiObject;
}> = async (request: Request, params: Params) => {
	const userApiObject = await requireUser(request)

  return {
    userApiObject,
  }
}


export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Mes formations PSE",
  };
};

export default function FromationPseRoute() {
  const { formationsPaginateObject } = useLoaderData<typeof loader>();

  return (
    <PageContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {formationsPaginateObject.data.map((formation) => (
            <TableRow key={formation.id}>
              <TableCell>
                <Link href={`/pse/${formation.id}`}>
                  {formation.title} {formation.place.title}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* TODO: paginaation */}
      </Table>
    </PageContainer>
  );
}
