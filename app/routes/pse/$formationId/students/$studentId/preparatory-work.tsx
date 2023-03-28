import { Checkbox, FormControlLabel } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DatePicker } from "@mui/x-date-pickers";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { parseISO } from "date-fns";
import { useImmer } from "use-immer";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import FormView from "~/component/form/FormView";
import InputHiddenJson from "~/component/form/InputHiddenJson";
import Section from "~/component/layout/Section";
import type { FormArrayWrapperDto } from "~/dto/form.dto";
import type { PseUserPreparatoryWorkPostDto } from "~/dto/pseuserpreparatorywork.dto";
import { validateForm } from "~/form/abstract";
import { pseUserPreparatoryWorkValidator } from "~/form/preparatorywork.form";
import type { SecurityFunction } from "~/helper/remix";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { redirectActionToCurrentPage } from "~/helper/responses.helper";
import { pseUserPreparatoryWorkApiObjectToPostDto, pseUserPreparatoryWorkPostDtoToApiObject } from "~/mapper/pseformationpreparatorywork.mapper";
import { getPseFormationById } from "~/service/pseformation.server";
import { getPreparatoryWorksForUser, updatePseUserPreparatoryWorks } from "~/service/pseformationpreparatorywork.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
  studentId: string;
}> = async (request: Request, params: Params) => {
  const { formationId, studentId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseFormationApiObject = await getPseFormationById(formationId)

  await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)
	
  return {
    pseFormationApiObject,
    studentId
  }
}

export async function loader({ request, params }: LoaderArgs) {
	const { pseFormationApiObject, studentId } = await security(request, params)

  const userPreparatoryWorksApiObjects = await getPreparatoryWorksForUser(pseFormationApiObject.id, studentId)

  return json({
    userPreparatoryWorksPost: userPreparatoryWorksApiObjects.map(pseUserPreparatoryWorkApiObjectToPostDto)
  })
}

export async function action({ request, params  }: ActionArgs) {
	const { pseFormationApiObject, studentId } = await security(request, params)

  const result = await validateForm<FormArrayWrapperDto<PseUserPreparatoryWorkPostDto>>(request, pseUserPreparatoryWorkValidator)
  if (result.errorResponse) {
    return result.errorResponse
  }

  const userPreparatoryWorks: Array<PseUserPreparatoryWorkPostDto> = result.data.array

  await updatePseUserPreparatoryWorks(
    pseFormationApiObject.id,
    studentId,
    userPreparatoryWorks.map(pseUserPreparatoryWorkPostDtoToApiObject)
  )

  return redirectActionToCurrentPage(request)
}

export default function PreparatoryWorkRoute() {
  const { userPreparatoryWorksPost } = useLoaderData<typeof loader>();

  const [ state, updateState ] = useImmer<Array<PseUserPreparatoryWorkPostDto>>(userPreparatoryWorksPost)

  function onSetRealisedDate(pseModuleId: string, realisedDate: Date | null) {
    updateState((draft: Array<PseUserPreparatoryWorkPostDto>) => {
      const preparatoryWork = draft.find((p) => p.pseModuleId === pseModuleId);

      if (preparatoryWork) {
        preparatoryWork.realisedDate = realisedDate ? realisedDate.toISOString() : null;
      }
    });
  }

  function onSetOpeningDate(pseModuleId: string, openingDate: Date | null) {
    updateState((draft: Array<PseUserPreparatoryWorkPostDto>) => {
      const preparatoryWork = draft.find((p) => p.pseModuleId === pseModuleId);

      if (preparatoryWork) {
        preparatoryWork.openingDate = openingDate ? openingDate.toISOString() : null;
      }
    });
  }

  function onSetRealised(pseModuleId: string, realised: boolean) {
    updateState((draft: Array<PseUserPreparatoryWorkPostDto>) => {
      const preparatoryWork = draft.find((p) => p.pseModuleId === pseModuleId);

      if (preparatoryWork) {
        preparatoryWork.realised = realised;
      }
    });
  }

	return (
    <Section title="Travail préparatoire">
      <FormView submitText="Sauvegarder" validator={pseUserPreparatoryWorkValidator}>
        <InputHiddenJson name="array" json={state} />

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
            {state.map((preparatoryWork, index) => (
              <TableRow key={preparatoryWork.pseModuleId}>
                <TableCell>
                  {index}. {preparatoryWork.pseModuleName}
                </TableCell>
                <TableCell>
                  <DatePicker 
                    value={preparatoryWork.openingDate ? parseISO(preparatoryWork.openingDate) : null} 
                    onChange={date => onSetOpeningDate(preparatoryWork.pseModuleId, date)}
                  />
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preparatoryWork.realised}
                        name={`[${preparatoryWork.pseModuleId}][realised]`}
                        onChange={(e) => {
                          onSetRealised(preparatoryWork.pseModuleId, e.target.checked)
                        }}
                      />
                    }
                    label=""
                  />
                </TableCell>
                <TableCell>
                  <DatePicker 
                    value={preparatoryWork.realisedDate ? parseISO(preparatoryWork.realisedDate) : null}
                    onChange={date => onSetRealisedDate(preparatoryWork.pseModuleId, date)} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </FormView>
    </Section>
  );
}