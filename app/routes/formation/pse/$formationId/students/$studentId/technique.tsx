import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Box, Stack } from "@mui/material";
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

const zparams = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

export async function loader({ params }: LoaderArgs) {
  const { formationId, studentId } = zparams.parse(params)


  const pseModuleApiObjects = await getPseModules()
  const pseUserTechniquesForUserApiObjects: Array<PseUserTechniqueApiObject> = await getPseUserTechniquesForUser(formationId, studentId)

  return json({
    pseUserTechniques: pseUserTechniquesForUserApiObjects.map(pseUserTechniqueApiObjectToDto),
    pseModules: pseModuleApiObjects.map(pseModuleApiObjectToDto),
  })
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
      {pseUserTechniques.map((pseUserTechnique: PseUserTechniqueDto) => (
        <div key={pseUserTechnique.technique.id}>
          <Box
            sx={{
              fontWeight: pseUserTechnique.technique.requiredForPse1
                ? 500
                : undefined,
            }}
          >
            <span>{pseUserTechnique.technique.name}</span>
            {pseUserTechnique.technique.requiredForPse1 && (
              <Typography variant="caption" sx={{ ml: 1 }}>
                PSE1
              </Typography>
            )}
          </Box>
        </div>
      ))}
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
            pseUserTechniques={pseUserTechniques}
          />
        ))}
      </Stack>
    </Section>
  );
}