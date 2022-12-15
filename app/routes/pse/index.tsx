import { Link, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { z } from "zod";
import PageContainer from "~/components/layout/PageContainer";
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
  const user = await requireUser(request);

	const { page, pageSize, orderBy, orderByDirection } = getSearchParamsOrFail(request, URLSearchParamsSchema)


  const formationsPaginatedObjectApiObject = await getUserPseFormations(user.id, page, pageSize, orderBy, orderByDirection)

  return json({
    formationsPaginateObject: paginateApiObjectToDto(formationsPaginatedObjectApiObject, pseFormationApiObjectToDto)
  });
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
