import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PseAcquiredLabel from "~/component/pse-summary/PseAcquiredLabel";
import type { PseUserConcreteCaseCompetenceGradeDtoEnum, PseUserConcreteCaseDto } from "~/dto/pseuserconcretecase.dto";
import type { PseUserSummaryConcreteCaseDto } from "~/dto/pseusersummary.dto";

interface Props {
  pseUserSummaryConcreteCase: PseUserSummaryConcreteCaseDto;
}

function Grade({ grade }: { grade: PseUserConcreteCaseCompetenceGradeDtoEnum }) {
  const label = grade === "NOT_EVALUATED" ? "" : grade;

  return (
    <Box sx={{ width: 16 }}>
      {label}
    </Box>
  );
}

function UserConcreteCaseRow({ pseUserConcreteCase }: { pseUserConcreteCase: PseUserConcreteCaseDto }) {
  return (
    <TableRow>
      <TableCell>
        {pseUserConcreteCase.pseConcreteCaseSituation.name}
      </TableCell>

      {pseUserConcreteCase.competences.map((competence) => (
        <TableCell key={competence.id}>
          <Grade grade={competence.grade} />
        </TableCell>
      ))}

      <TableCell>
        {/* TODO: form to select / unselect */}
        <Checkbox checked={pseUserConcreteCase.selected} />
      </TableCell>
    </TableRow>
  );
}

export default function PseUserConcreteCasesTable({ pseUserSummaryConcreteCase }: Props) {

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{/* empty name : */}</TableCell>
            {pseUserSummaryConcreteCase.competencesSummary.map(
              (competenceResult) => (
                <TableCell key={competenceResult.pseCompetence.id}>
                  {competenceResult.pseCompetence.id}
                </TableCell>
              )
            )}

            <TableCell>{/* empty header selected: */}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {/* concrete case rows */}
          {pseUserSummaryConcreteCase.userConcreteCases.map(
            (pseUserConcreteCase) => (
              <UserConcreteCaseRow
                key={pseUserConcreteCase.id}
                pseUserConcreteCase={pseUserConcreteCase}
              />
            )
          )}

          {/* RESULTS row */}
          <TableRow>
            <TableCell>
              <Box sx={{ fontWeight: 500 }} component="span">
                RÉSULTAT
              </Box>
            </TableCell>
            {pseUserSummaryConcreteCase.competencesSummary.map(
              (competenceResult) => (
                <TableCell key={competenceResult.pseCompetence.id}>
                  <PseAcquiredLabel
                    acquired={competenceResult.acquired}
                    acquiredForPse1={competenceResult.acquiredForPse1}
                  />
                </TableCell>
              )
            )}

            {/* empty selected: */}
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}