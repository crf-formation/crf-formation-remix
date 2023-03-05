import { Box, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { PseUserConcreteCaseCompetenceGradeDtoEnum, PseUserConcreteCaseDto } from "~/dto/pseuserconcretecase.dto";
import type { PseUserSummaryConcreteCaseDto } from "~/dto/pseusesummary.dto";

interface Props {
	pseUserSummaryConcreteCase: PseUserSummaryConcreteCaseDto;
}

function Grade({ grade }: { grade: PseUserConcreteCaseCompetenceGradeDtoEnum }) {
	const label = grade === 'NOT_EVALUATED' ? '' : grade

	return (
		<Box sx={{ width: 16 }}>
			{label}
		</Box>
	)
}

function Acquired({ acquired, acquiredForPse1 }: { acquired: boolean, acquiredForPse1: boolean }) {
	const sx = {
		fontWeight: 500,
	}
	
	if (acquired) {
		return <Box sx={{ ...sx, color: 'success.main' }}>OUI</Box>
	}

	if (acquiredForPse1) {
		return <Box sx={{ ...sx, color: 'warning.main' }}>PSE1</Box>
	}

	return <Box sx={{ ...sx, color: 'error.main' }}>NON</Box>
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
            {pseUserSummaryConcreteCase.competenceResults.map(
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
            {pseUserSummaryConcreteCase.competenceResults.map(
              (competenceResult) => (
                <TableCell key={competenceResult.pseCompetence.id}>
                  <Acquired
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