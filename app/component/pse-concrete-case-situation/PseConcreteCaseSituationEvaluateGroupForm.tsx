import { Box, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import type { PseCompetenceDto } from "~/dto/psecompetence.dto";
import type { PseConcreteCaseGroupDto } from "~/dto/pseconcretecasegroup.dto";
import type { PseConcreteCaseSituationDto } from "~/dto/pseconcretecasesituation.dto";
import { PseUserConcreteCaseCompetenceGradeZEnum } from "~/dto/pseuserconcretecase.dto";
import { pseConcreteCaseSituationGroupEvaluatePostDtoValidator } from "~/form/pseuserconcretecase.form";
import FormView from "../form/FormView";

interface Props {
  formationId: string;
  pseConcreteCaseSituation: PseConcreteCaseSituationDto;
  pseConcreteCaseGroup: PseConcreteCaseGroupDto;
  pseCompetences: Array<PseCompetenceDto>;
}


interface PseCompetenceRowProps { 
  pseCompetence: PseCompetenceDto, 
  shouldBeEvaluated: boolean, 
  pseConcreteCaseGroup: PseConcreteCaseGroupDto 
}

function PseCompetenceRow({ pseCompetence, shouldBeEvaluated, pseConcreteCaseGroup }: PseCompetenceRowProps) {
  if (!shouldBeEvaluated) {
    return null
  }

  return (
    <TableRow key={pseCompetence.id}>
      <TableCell>
        <Typography variant="subtitle2">{pseCompetence.id}</Typography>
        <Typography variant="subtitle2">{pseCompetence.description}</Typography>
      </TableCell>
      {pseConcreteCaseGroup.students.map((student) => (
        <TableCell key={student.id}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            {PseUserConcreteCaseCompetenceGradeZEnum.options.map((option) => (
              <Box key={option}>
                {/* TODO: color */}
                <Checkbox sx={{ padding: 0 }} />
              </Box>
            ))}
          </Box>
        </TableCell>
      ))}
    </TableRow>
  );
}

export default function PseConcreteCaseSituationEvaluateGroupForm({
  formationId,
  pseConcreteCaseGroup,
  pseConcreteCaseSituation,
  pseCompetences,
}: Props) {
  const pseCompetenceIdsToEvaluate = pseCompetences.filter((pseCompetence) =>
    pseConcreteCaseSituation.pseConcreteCaseType.competencesToEvaluate.find(
      (competenceToEvaluate) => competenceToEvaluate.id === pseCompetence.id
    )
  ).map(pseCompetence => pseCompetence.id);

  return (
    <FormView
      submitText="Sauvegarder"
      validator={pseConcreteCaseSituationGroupEvaluatePostDtoValidator}
    >
      <input type="hidden" name="formationId" value={formationId} />
      <input type="hidden" name="pseConcreteCaseSituationId" value={pseConcreteCaseSituation.id} />
      <input type="hidden" name="pseSituationConcreteCaseId" value={pseConcreteCaseGroup.id} />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Compétences</TableCell>
            {pseConcreteCaseGroup.students.map((student) => (
              <TableCell 
                key={student.id} 
                align="center"
                sx={{
                  width: 200,
                }}
              >
                {/* TODO: user picture */}
                {student.user.fullName}
                <br />
                {/* TODO: role */}
                {/* <br /> */}
                <Box
                  style={{
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                    marginTop: 2,
                  }}
                >
                  <Box
                    style={{
                      width: 24,
                      textAlign: "center",
                    }}
                  >
                    <label>A</label>
                  </Box>
                  <Box
                    style={{
                      marginLeft: 2,
                      width: 24,
                      textAlign: "center",
                    }}
                  >
                    <label>B</label>
                  </Box>
                  <Box
                    style={{
                      width: 24,
                      textAlign: "center",
                    }}
                  >
                    <label>C</label>
                  </Box>
                  <Box
                    style={{
                      width: 24,
                      textAlign: "center",
                    }}
                  >
                    <label>D</label>
                  </Box>
                  <Box
                    style={{
                      width: 24,
                      textAlign: "center",
                    }}
                  >
                    <label>-</label>
                  </Box>
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {pseCompetences.map((pseCompetence) => (
            <PseCompetenceRow 
              key={pseCompetence.id}
              pseCompetence={pseCompetence} 
              pseConcreteCaseGroup={pseConcreteCaseGroup} 
              shouldBeEvaluated={pseCompetenceIdsToEvaluate.includes(pseCompetence.id)} 
            />
          ))}
        </TableBody>
      </Table>
    </FormView>
  );
}
