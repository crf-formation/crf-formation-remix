import type { Params} from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import Section from "~/components/layout/Section";
import { pseUserPreparatoryWorkApiObjectToDto } from "~/mapper/pseformationpreparatorywork.mapper";
import { getPreparatoryWorksForUser } from "~/services/pseformationpreparatorywork.server";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FormControlLabel, Checkbox } from "@mui/material";
import { getParamsOrFail } from "~/utils/remix.params";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { SecurityFunction } from "~/constants/remix";
import { getPseFormationById } from "~/services/pseformation.server";
import { requireUser } from "~/services/session.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/services/security.server";

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

export async function loader({ request, params }: LoaderArgs) {
	await security(request, params)

  const { formationId, studentId } = getParamsOrFail(params, ParamsSchema)

  const preparatoryWorksApiObjects = await getPreparatoryWorksForUser(formationId, studentId)

  return json({
    preparatoryWorks: preparatoryWorksApiObjects.map(pseUserPreparatoryWorkApiObjectToDto)
  })
}

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