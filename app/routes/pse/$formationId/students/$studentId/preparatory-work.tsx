import { Checkbox, FormControlLabel } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import Section from "~/component/layout/Section";
import type { SecurityFunction } from "~/helper/remix";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { pseUserPreparatoryWorkApiObjectToDto } from "~/mapper/pseformationpreparatorywork.mapper";
import { getPseFormationById } from "~/service/pseformation.server";
import { getPreparatoryWorksForUser } from "~/service/pseformationpreparatorywork.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseFormationApiObject = await getPseFormationById(formationId)

  await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)
	
  return {
    pseFormationApiObject,
  }
}

export async function loader({ request, params }: LoaderArgs) {
	await security(request, params)

  const { formationId, studentId } = getParamsOrFail(params, ParamsSchema)

  const preparatoryWorksApiObjects = await getPreparatoryWorksForUser(formationId, studentId)

  return json({
    preparatoryWorks: preparatoryWorksApiObjects.map(pseUserPreparatoryWorkApiObjectToDto)
  })
}

export default function PreparatoryWorkRoute() {
  const { preparatoryWorks } = useLoaderData<typeof loader>();

	return (
    <Section title="Travail préparatoire">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Modules</TableCell>
            <TableCell>Ouverture des accès</TableCell>
            <TableCell>Fait</TableCell>
            <TableCell>Date de réalisation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {preparatoryWorks.map((preparatoryWork, index) => (
            <TableRow key={preparatoryWork.pseModuleId}>
              <TableCell>
                {index}. {preparatoryWork.pseModule.name}
              </TableCell>
              <TableCell>{preparatoryWork.openingDate}</TableCell> 
              <TableCell>{preparatoryWork.realised}
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={preparatoryWork.realised}
                    name={`[${preparatoryWork.pseModuleId}][realised]`}
                  />
                }
                label=""
              />
              </TableCell>
              <TableCell>{preparatoryWork.openingDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}