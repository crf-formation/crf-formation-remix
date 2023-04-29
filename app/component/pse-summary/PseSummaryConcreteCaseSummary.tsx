import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { ReactNode } from "react";
import PseAcquiredLabel from "~/component/pse-summary/PseAcquiredLabel";
import type { PseConcreteCaseSummaryDto, PseConcreteCaseUserSummaryDto } from "~/dto/psesummary.dto";

interface Props {
  concreteCaseSummary: PseConcreteCaseSummaryDto;
}

function CompetenceAcquiredLabel(
  {
    children,
    acquired,
    acquiredForPse1,
    isInDifficulty
  }: {
    children: ReactNode,
    acquired: boolean,
    acquiredForPse1: boolean,
    isInDifficulty: boolean
  }) {
  const theme = {
    acquired: { color: "success.main" },
    acquiredForPse1: { fontWeight: 500, color: "warning.main" },
    isInDifficulty: { fontWeight: 600, color: "error.main" }
  };

  const sx = [
    isInDifficulty && theme.isInDifficulty,
    acquired && theme.acquired,
    acquiredForPse1 && theme.acquiredForPse1
  ].filter(Boolean)[0];

  return <Box sx={{ ...sx }}>{children}</Box>;
}

function UserSummaryTableRow({ userSummary }: { userSummary: PseConcreteCaseUserSummaryDto }) {
  return (
    <TableRow>
      <TableCell>{userSummary.user.fullName}</TableCell>

      {userSummary.competencesSummary.map((competenceSummary) => (
        <TableCell key={competenceSummary.pseCompetenceId}>
          <CompetenceAcquiredLabel
            acquired={competenceSummary.acquired}
            acquiredForPse1={competenceSummary.acquiredForPse1}
            isInDifficulty={competenceSummary.isInDifficulty}
          >
            <span>{competenceSummary.nbAcquired}{"/"}{competenceSummary.nbTotal}</span>
          </CompetenceAcquiredLabel>
        </TableCell>
      ))}

      <TableCell>
        <PseAcquiredLabel
          acquired={userSummary.hasAcquiredAll}
          acquiredForPse1={userSummary.hasAcquiredAllForPse1}
        />
      </TableCell>
    </TableRow>
  );
}

export default function PseSummaryConcreteCaseSummary({ concreteCaseSummary }: Props) {
  return (
    <TableContainer>
      <Table>

        {/* TODO: row isInDifficulty? */}
        <TableHead>
          <TableRow>
            <TableCell>{/* user fullName */}</TableCell>

            {concreteCaseSummary.usersSummary[0].competencesSummary.map((competenceSummary) => (
              <TableCell key={competenceSummary.pseCompetenceId}>
                {competenceSummary.pseCompetenceId}
              </TableCell>
            ))}

            <TableCell>Validé</TableCell>

          </TableRow>

        </TableHead>
        <TableBody>
          {concreteCaseSummary.usersSummary.map((userSummary) => (
            <UserSummaryTableRow key={userSummary.user.id} userSummary={userSummary} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}