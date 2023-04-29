import { Link, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { LoaderArgs } from "@remix-run/node";
import { json, V2_MetaFunction } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import Page from "~/component/layout/Page";
import Section from "~/component/layout/Section";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getSearchParamsOrFail } from "~/helper/remix.params.helper";
import { paginateApiObjectToDto } from "~/mapper/abstract.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getUserPseFormations } from "~/service/pseformation.server";
import { requireUser } from "~/service/session.server";

const URLSearchParamsSchema = z.object({
  page: z.number().default(0),
  pageSize: z.number().default(25),
  orderBy: z.string().default("createdAt"),
  orderByDirection: z.enum(["asc", "desc"]).default("desc")
});

const security: SecurityFunction<{
  userApiObject: UserApiObject;
}> = async (request: Request, params: Params) => {
  const userApiObject = await requireUser(request);

  return {
    userApiObject
  };
};

export async function loader({ request, params }: LoaderArgs) {
  const { userApiObject } = await security(request, params);


  const { page, pageSize, orderBy, orderByDirection } = getSearchParamsOrFail(request, URLSearchParamsSchema);


  const formationsPaginatedObjectApiObject = await getUserPseFormations(userApiObject.id, page, pageSize, orderBy, orderByDirection);

  return json({
    formationsPaginateObject: paginateApiObjectToDto(formationsPaginatedObjectApiObject, pseFormationApiObjectToDto)
  });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Mes formations PSE` }
  ];
};

export default function FromationPseRoute() {
  const { formationsPaginateObject } = useLoaderData<typeof loader>();

  return (
    <Page
      title="Formations PSE"
      subtitle={`Retrouvez la liste de vos formations`}
    >

      <Section>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Lieu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formationsPaginateObject.data.map((formation) => (
              <TableRow key={formation.id}>
                <TableCell>
                  <Link href={`/pse/${formation.id}`}>{formation.title}</Link>
                </TableCell>
                <TableCell>{formation.place.title}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* TODO: paginaation */}
        </Table>
      </Section>

    </Page>
  );
}
