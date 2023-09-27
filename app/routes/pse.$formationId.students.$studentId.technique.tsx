import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { groupBy, map } from "lodash";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { PseUserTechniqueApiObject } from "~/apiobject/pseusertechnique.apiobject";
import Section from "~/component/layout/Section";
import type { PseModuleDto } from "~/dto/psemodule.dto";
import type { PseUserTechniqueDto } from "~/dto/pseusertechnique.dto";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { pseModuleApiObjectToDto } from "~/mapper/psemodule.mapper";
import { pseUserTechniqueApiObjectToDto } from "~/mapper/pseusertechnique.mapper";
import { getPseFormationById } from "~/service/pseformation.server";
import { getPseModules } from "~/service/psemodule.server";
import { getPseUserTechniquesForUser } from "~/service/pseusertechniques.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";
import { V2_MetaFunction } from "@remix-run/node";

const ParamsSchema = z.object({
  formationId: z.string(),
  studentId: z.string()
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId } = getParamsOrFail(params, ParamsSchema);

  const userApiObject = await requireUser(request);

  const pseFormationApiObject = await getPseFormationById(formationId);

  await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id);

  return {
    pseFormationApiObject
  };
};

export async function loader({ request, params }: LoaderArgs) {
  await security(request, params);

  const { formationId, studentId } = getParamsOrFail(params, ParamsSchema);

  const pseModuleApiObjects = await getPseModules();
  const pseUserTechniquesForUserApiObjects: Array<PseUserTechniqueApiObject> = await getPseUserTechniquesForUser(formationId, studentId);

  return json({
    pseUserTechniques: pseUserTechniquesForUserApiObjects.map(pseUserTechniqueApiObjectToDto),
    pseModules: pseModuleApiObjects.map(pseModuleApiObjectToDto)
  });
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: `Techniques` }
  ];
};

function ModuleView({ pseModule, pseUserTechniques }: {
  pseModule?: PseModuleDto;
  pseUserTechniques: Array<PseUserTechniqueDto>
}) {
  if (!pseModule) {
    return null;
  }

  return (
    <Section
      title={
        <span>
          {pseModule.id} {pseModule.name}
        </span>
      }
      action={<Button variant="outlined" size="small" sx={{ mb: 1 }}>Valider</Button>}
    >
      <Stack spacing={1}>
        {pseUserTechniques.map((pseUserTechnique: PseUserTechniqueDto) => (
          <div key={pseUserTechnique.technique.id}>
            <Box
              sx={{
                fontWeight: pseUserTechnique.technique.requiredForPse1
                  ? 500
                  : undefined
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

  const groupedByModule = groupBy(pseUserTechniques, pseUserTechnique => pseUserTechnique.technique.pseModuleId);

  return (
    <Section title="Techniques">
      <Box sx={{ my: 2 }}>
        <Button variant="outlined">Tout valider</Button>
      </Box>

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