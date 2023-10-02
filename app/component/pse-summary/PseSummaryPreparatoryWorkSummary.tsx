import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PseAcquiredLabel from "~/component/pse-summary/PseAcquiredLabel";
import type { PsePreparatoryWorkSummaryDto, PsePreparatoryWorkUserSummaryDto } from "~/dto/psesummary.dto";

interface Props {
  preparatoryWorkSummary: PsePreparatoryWorkSummaryDto;
}

function UserSummaryTableRow({ userSummary }: { userSummary: PsePreparatoryWorkUserSummaryDto }) {
  return (
    <TableRow>
      <TableCell>{userSummary.user.fullName}</TableCell>

      <TableCell><PseAcquiredLabel acquired={userSummary.preparatoryWork.hasRealisedAllModules} /></TableCell>

    </TableRow>
  );
}

export default function PseSummaryPreparatoryWorkSummary({ preparatoryWorkSummary }: Props) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{/* user fullName */}</TableCell>

            <TableCell>Validé</TableCell>
          </TableRow>

        </TableHead>
        <TableBody>
          {preparatoryWorkSummary.usersSummary.map((userSummary) => (
            <UserSummaryTableRow key={userSummary.user.id} userSummary={userSummary} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}