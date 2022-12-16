import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Link,
  TableContainer,
} from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs, MetaFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import PageContainer from "~/components/layout/PageContainer";
import PageTitle from "~/components/layout/PageTitle";
import Section from "~/components/layout/Section";
import { paginateApiObjectToDto } from "~/mapper/abstract.mapper";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { getPseFormationConcreteCaseSessions } from "~/services/pseconcretecasesession.server";
import { requireUser } from "~/services/session.server";
import { getParamsOrFail, getSearchParamsOrFail } from "~/utils/remix.params";

const ParamsSchema = z.object({
  formationId: z.string(),
});

const URLSearchParamsSchema = z.object({
  page: z.number().default(0),
  pageSize: z.number().default(25),
  orderBy: z.string().default("createdAt"),
  orderByDirection: z.enum(["asc", "desc"]).default("desc"),
});

export async function loader({ request, params }: LoaderArgs) {
  await requireUser(request);

  const { formationId } = getParamsOrFail(params, ParamsSchema);
  const { page, pageSize, orderBy, orderByDirection } = getSearchParamsOrFail(
    request,
    URLSearchParamsSchema
  );

  const concreteCaseSessionsPaginateObject =
    await getPseFormationConcreteCaseSessions(
      formationId,
      page,
      pageSize,
      orderBy,
      orderByDirection
    );

  return json({
    formationId,
    concreteCaseSessionsPaginateObject: paginateApiObjectToDto(
      concreteCaseSessionsPaginateObject,
      pseConcreteCaseSessionApiObjectToDto
    ),
  });
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Sessions",
  };
};

export default function ConcreteCaseSessionsRoute() {
  const { formationId, concreteCaseSessionsPaginateObject } =
    useLoaderData<typeof loader>();

  return (
    <PageContainer>
      <PageTitle title="Sessions" />
      <Section>
        <Link href={`/pse/${formationId}/concrete-case/session/new`}>
          <Button>Créer une session</Button>
        </Link>
        <TableContainer sx={{ mt: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Modules</TableCell>
                <TableCell>Ouverture des accès</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {concreteCaseSessionsPaginateObject.data.map(
                (concreteCaseSession) => (
                  <TableRow key={concreteCaseSession.id}>
                    <TableCell>
                      <Link
                        href={`/pse-concrete-case-session/${concreteCaseSession.id}`}
                      >
                        {concreteCaseSession.name}
                      </Link>
                    </TableCell>
                    <TableCell>{concreteCaseSession.state}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
            {/* TODO: paginaation */}
          </Table>
        </TableContainer>
      </Section>
    </PageContainer>
  );
}
