import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { map, groupBy } from "lodash";
import Section from "~/components/layout/Section";
import { pseUserTechniqueApiObjectToDto } from "~/mapper/pseusertechnique.mapper";
import { getPseUserTechniquesForUser } from "~/services/pseusertechniques.server";
import type { PseUserTechniqueApiObject } from "~/apiobject/pseusertechnique.apiobject";

const zparams = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

export async function loader({ params }: LoaderArgs) {
  const { formationId, studentId } = zparams.parse(params)


  const pseUserTechniquesForUserApiObjects: Array<PseUserTechniqueApiObject> = await getPseUserTechniquesForUser(formationId, studentId)

  return json({
    userTechniques: pseUserTechniquesForUserApiObjects.map(pseUserTechniqueApiObjectToDto)
  })
}

export default function TechniqueRoute() {
  const { userTechniques } = useLoaderData<typeof loader>();

  const groupedByModule = groupBy(userTechniques, pseUserTechnique => pseUserTechnique.technique.pseModuleId)
  console.log({ groupedByModule })

	return (
    <Section title="Techniques">
      {map(groupedByModule, (userTechniques, moduleId) => (
        <div>
          {userTechniques.map(userTechnique => (
            <div key={userTechnique.technique.id}>{userTechnique.technique.name}</div>
          ))}
        </div>
      ))}
    </Section>
  );
}