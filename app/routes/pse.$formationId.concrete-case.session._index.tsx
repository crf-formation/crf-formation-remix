import { Button, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import { Ariane, ArianeItem } from "~/component/layout/Ariane";
import PageContainer from "~/component/layout/PageContainer";
import PagePaperHeader from "~/component/layout/PagePaperHeader";
import PageSpace from "~/component/layout/PageSpace";
import PageTitle from "~/component/layout/PageTitle";
import Section from "~/component/layout/Section";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail, getSearchParamsOrFail } from "~/helper/remix.params.helper";
import { paginateApiObjectToDto } from "~/mapper/abstract.mapper";
import { pseConcreteCaseSessionApiObjectToDto } from "~/mapper/pseconcretecasesession.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseFormationConcreteCaseSessions } from "~/service/pseconcretecasesession.server";
import { findPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";
import type { V2_MetaFunction } from "@remix-run/node";

const ParamsSchema = z.object({
  formationId: z.string()
});

const URLSearchParamsSchema = z.object({
  page: z.number().default(0),
  pageSize: z.number().default(25),
  orderBy: z.string().default("createdAt"),
  orderByDirection: z.enum(["asc", "desc"]).default("desc")
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId } = getParamsOrFail(params, ParamsSchema);

  const userApiObject = await requireUser(request);

  const pseFormationApiObject = await findPseFormationById(formationId);

  if (!pseFormationApiObject) {
    throw new Error(`Formation not found: ${formationId}`);
  }

  await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id);

  return {
    pseFormationApiObject
  };
};

export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject } = await security(request, params);

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
    pseFormation: pseFormationApiObjectToDto(pseFormationApiObject),
    concreteCaseSessionsPaginateObject: paginateApiObjectToDto(
      concreteCaseSessionsPaginateObject,
      pseConcreteCaseSessionApiObjectToDto
    )
  });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Sessions` }
  ];
};

export default function ConcreteCaseSessionsRoute() {
  const { pseFormation, concreteCaseSessionsPaginateObject } = useLoaderData<typeof loader>();

  return (
    <>
      <PagePaperHeader
        ariane={
          <Ariane>
            <ArianeItem label="PSE" href="pse" />

            <ArianeItem
              label={pseFormation.title}
              href={`/pse/${pseFormation.id}`}
            />
          </Ariane>
        }
      >
        <PageTitle title="Cas concrets" />
      </PagePaperHeader>

      <PageSpace variant="header" />

      <PageContainer>
        <Section>
          <Button
            variant="outlined"
            href={`/pse/${pseFormation.id}/concrete-case/session/new`}
          >
            Créer une session
          </Button>
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
    </>
  );
}
