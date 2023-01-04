import {
    Button,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs, MetaFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import PageContainer from "~/component/layout/PageContainer";
import PageTitle from "~/component/layout/PageTitle";
import Section from "~/component/layout/Section";
import type { SecurityFunction } from "~/constant/remix";
import { paginateApiObjectToDto } from "~/mapper/abstract.mapper";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { getPseFormationConcreteCaseSessions } from "~/service/pseconcretecasesession.server";
import { findPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";
import { getParamsOrFail, getSearchParamsOrFail } from "~/util/remix.params";

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
  const { pseFormationApiObject }  = await security(request, params);

  const { page, pageSize, orderBy, orderByDirection } = getSearchParamsOrFail(
    request,
    URLSearchParamsSchema
  );

  const concreteCaseSessionsPaginateObject =
    await getPseFormationConcreteCaseSessions(
      pseFormationApiObject.id,
      page,
      pageSize,
      orderBy,
      orderByDirection
    );

  return json({
    formationId: pseFormationApiObject.id,
    concreteCaseSessionsPaginateObject: paginateApiObjectToDto(
      concreteCaseSessionsPaginateObject,
      pseConcreteCaseSessionApiObjectToDto
    ),
  });
}

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseFormationApiObject = await findPseFormationById(formationId)
	
	if (!pseFormationApiObject) {
		throw new Error(`Formation not found: ${formationId}`);
	}
	
	await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)

  return {
    pseFormationApiObject,
  }
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
                    <TableCell>{concreteCaseSession.stateLabel}</TableCell>
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
