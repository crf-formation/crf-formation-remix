import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import PseAcquiredLabel from '~/component/pse-summary/PseAcquiredLabel';
import type { PseTechniqueSummaryDto, PseTechniqueUserSummaryDto } from "~/dto/psesummary.dto";

interface Props {
	techniqueSummary: PseTechniqueSummaryDto
}

function UserSummaryTableRow({ userSummary }: { userSummary: PseTechniqueUserSummaryDto }) {
	return (
    <TableRow>
      <TableCell>{userSummary.user.fullName}</TableCell>

      <TableCell>
          <PseAcquiredLabel 
            acquired={userSummary.technique.hasAcquiredAllTechniques}
            acquiredForPse1={userSummary.technique.hasAcquiredAllTechniquesToValidatePse1}
          />
      </TableCell>

      <TableCell>
        {userSummary.technique.nbNotAcquired}
      </TableCell>
      
    </TableRow>
  );
}

export default function PseSummaryTechniqueSummary({ techniqueSummary }: Props) {
	return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{/* user fullName */}</TableCell>

						<TableCell>Validé</TableCell>

						<TableCell>Manquantes</TableCell>

          </TableRow>

        </TableHead>
        <TableBody>
          {techniqueSummary.usersSummary.map((userSummary) => (
            <UserSummaryTableRow key={userSummary.user.id} userSummary={userSummary} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}