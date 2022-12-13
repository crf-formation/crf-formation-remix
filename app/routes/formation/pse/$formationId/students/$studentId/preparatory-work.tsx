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

const zparams = z.object({
  formationId: z.string(),
  studentId: z.string(),
})

export async function loader({ params }: LoaderArgs) {
  const { formationId, studentId } = zparams.parse(params)


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
              <TableCell>{preparatoryWork.realised}</TableCell>
              <TableCell>{preparatoryWork.openingDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}