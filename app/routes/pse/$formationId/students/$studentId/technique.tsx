import { Typography, Box, Stack, Checkbox, FormControlLabel } from "@mui/material";
import type { Params} from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { map, groupBy } from "lodash";
import Section from "~/components/layout/Section";
import { pseUserTechniqueApiObjectToDto } from "~/mapper/pseusertechnique.mapper";
import { getPseUserTechniquesForUser } from "~/services/pseusertechniques.server";
import type { PseUserTechniqueApiObject } from "~/apiobject/pseusertechnique.apiobject";
import { getPseModules } from "~/services/psemodule.server";
import { pseModuleApiObjectToDto } from "~/mapper/psemodule.mapper";
import type { PseModuleDto } from "~/dto/psemodule.dto";
import type { PseUserTechniqueDto } from "~/dto/pseusertechnique.dto";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { SecurityFunction } from "~/constants/remix";
import { getPseFormationById } from "~/services/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/services/security.server";
import { requireUser } from "~/services/session.server";
import { getParamsOrFail } from "~/utils/remix.params";

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

export async function loader({ request, params }: LoaderArgs) {
  await security(request, params)

  const { formationId, studentId } = getParamsOrFail(params, ParamsSchema)

  const pseModuleApiObjects = await getPseModules()
  const pseUserTechniquesForUserApiObjects: Array<PseUserTechniqueApiObject> = await getPseUserTechniquesForUser(formationId, studentId)

  return json({
    pseUserTechniques: pseUserTechniquesForUserApiObjects.map(pseUserTechniqueApiObjectToDto),
    pseModules: pseModuleApiObjects.map(pseModuleApiObjectToDto),
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

function ModuleView({ pseModule, pseUserTechniques }: { pseModule?: PseModuleDto; pseUserTechniques: Array<PseUserTechniqueDto> }) {
  if (!pseModule) {
    return null
  }

  return (
    <Section
      title={
        <span>
          {pseModule.id} {pseModule.name}
        </span>
      }
    >
      <Stack spacing={1}>
        {pseUserTechniques.map((pseUserTechnique: PseUserTechniqueDto) => (
          <div key={pseUserTechnique.technique.id}>
            <Box
              sx={{
                fontWeight: pseUserTechnique.technique.requiredForPse1
                  ? 500
                  : undefined,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={pseUserTechnique.acquired}
                    name={pseUserTechnique.technique.id}
                  />
                }
                label={
                  <span>
                    <span>{pseUserTechnique.technique.name}</span>
                    {pseUserTechnique.technique.requiredForPse1 && (
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        PSE1
                      </Typography>
                    )}
                  </span>
                }
              />
            </Box>
          </div>
        ))}
      </Stack>
    </Section>
  );
}

export default function TechniqueRoute() {
  const { pseUserTechniques, pseModules } = useLoaderData<typeof loader>();

  const groupedByModule = groupBy(pseUserTechniques, pseUserTechnique => pseUserTechnique.technique.pseModuleId)

	return (
    <Section title="Techniques">
      <Stack spacing={2}>
        {map(groupedByModule, (pseUserTechniques, moduleId) => (
          <ModuleView
            pseModule={pseModules.find((m) => m.id === moduleId)}
            pseUserTechniques={pseUserTechniques as Array<PseUserTechniqueDto>}
          />
        ))}
      </Stack>
    </Section>
  );
}