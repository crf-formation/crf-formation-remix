import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import PseAcquiredLabel from "~/component/pse-summary/PseAcquiredLabel";
import type { PseResultSummaryDto, PseResultUserSummaryDto } from "~/dto/psesummary.dto";

interface Props {
	resultSummary: PseResultSummaryDto
}

function UserSummaryTableRow({ userSummary }: { userSummary: PseResultUserSummaryDto }) {
	return (
    <TableRow>
      <TableCell>{userSummary.user.fullName}</TableCell>

      <TableCell>
        <PseAcquiredLabel
          acquired={userSummary.hasValidatedPrepratoryWork}
        />
      </TableCell>

      <TableCell>
        <PseAcquiredLabel
          acquired={userSummary.hasValidatedTechniquesPse}
          acquiredForPse1={userSummary.hasValidatedTechniquesPse1}
        />
      </TableCell>

      <TableCell>
        <PseAcquiredLabel
          acquired={userSummary.hasValidatedConcreteCasePse}
          acquiredForPse1={userSummary.hasValidatedConcreteCasePse1}
        />
      </TableCell>

      <TableCell>
        <PseAcquiredLabel
          acquired={userSummary.hasValidatedPse}
          acquiredForPse1={userSummary.hasValidatedPse1}
        />
      </TableCell>
      
    </TableRow>
  );
}

export default function PseSummaryResult({ resultSummary }: Props) {
	return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{/* user fullName */}</TableCell>

            <TableCell>Travail préparatoire</TableCell>
            <TableCell>Techniques</TableCell>
            <TableCell>Pratique</TableCell>
            <TableCell>Validé</TableCell>
          </TableRow>

        </TableHead>
        <TableBody>
          {resultSummary.usersSummary.map((userSummary) => (
            <UserSummaryTableRow key={userSummary.user.id} userSummary={userSummary} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}