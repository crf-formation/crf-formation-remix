import { Box, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useImmer } from 'use-immer';
import InputHiddenJson from "~/component/form/InputHiddenJson";
import type { PseCompetenceDto } from "~/dto/psecompetence.dto";
import type PseUserEvaluationDto from '~/dto/pseuserconcretecase.dto';
import type { PseUserConcreteCaseCompetenceGradeDtoEnum, PseUserConcreteCaseGroupEvaluationDto } from '~/dto/pseuserconcretecase.dto';
import { PseUserConcreteCaseCompetenceGradeZEnum } from '~/dto/pseuserconcretecase.dto';
import { pseUserConcreteCaseGroupEvaluationPostDtoValidator } from "~/form/pseuserconcretecase.form";
import FormView from "../form/FormView";

interface Props {
  pseUserConcreteCaseGroupEvaluation: PseUserConcreteCaseGroupEvaluationDto;
}

interface PseCompetenceRowProps { 
  pseCompetence: PseCompetenceDto, 
  shouldBeEvaluated: boolean, 
  pseUserConcreteCaseUsersGrades: Array<PseUserConcreteCaseUsersGradesDto>
  onSetGradeForUser: (userId: string, competenceId: string, grade: PseUserConcreteCaseCompetenceGradeDtoEnum) => void
}

function PseCompetenceRow({ 
  pseCompetence, 
  shouldBeEvaluated, 
  pseUserConcreteCaseUsersGrades,
  onSetGradeForUser
 }: PseCompetenceRowProps) {
  if (!shouldBeEvaluated) {
    return null
  }

  return (
    <TableRow key={pseCompetence.id}>
      <TableCell>
        <Typography variant="subtitle2">{pseCompetence.id}</Typography>
        <Typography variant="subtitle2">{pseCompetence.description}</Typography>
      </TableCell>
      {pseUserConcreteCaseUsersGrades.map((studentGrades) => (
        <TableCell key={studentGrades.userId}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            {PseUserConcreteCaseCompetenceGradeZEnum.options.map((grade) => {
              const userGrade = studentGrades.grades.find(grade => grade.pseCompetenceId === pseCompetence.id)

              return (
                <Box key={grade}>
                  <Checkbox
                    sx={{ padding: 0 }}
                    checked={userGrade?.grade === grade}
                    onClick={() => {
                      onSetGradeForUser(studentGrades.userId, pseCompetence.id, grade);
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </TableCell>
      ))}
    </TableRow>
  );
}

export default function PseConcreteCaseSituationEvaluateGroupForm({
  pseUserConcreteCaseGroupEvaluation
}: Props) {
  const [pseUserConcreteCaseUsersGrades, updatePseUserConcreteCaseUsersGrades] 
    = useImmer<Array<PseUserEvaluationDto>>(() => [...pseUserConcreteCaseGroupEvaluation.usersGrades])


  function onSetGradeForUser(
    userId: string,
    competenceId: string,
    grade: PseUserConcreteCaseCompetenceGradeDtoEnum
  ) {
    updatePseUserConcreteCaseUsersGrades((draft: Array<PseUserEvaluationDto>) => {
      const studentGrades: PseUserEvaluationDto | undefined = draft.find((studentGrades) => studentGrades.userId === userId);
      if (!studentGrades) {
        throw new Error(`User ${userId} does not exist`);
      }

      const userGradeToUpdate = studentGrades.grades.find(
        (grade) => grade.pseCompetenceId === competenceId
      );
      if (!userGradeToUpdate) {
        throw new Error(
          `Grade not found for user ${studentGrades.userId} and competence ${competenceId}`
        );
      }

      userGradeToUpdate.grade = grade;
    });
  }

  return (
    <FormView
      submitText="Sauvegarder"
      validator={pseUserConcreteCaseGroupEvaluationPostDtoValidator}
    >
      <input type="hidden" name="formationId" value={pseUserConcreteCaseGroupEvaluation.formationId} />
      <input type="hidden" name="pseConcreteCaseSituationId" value={pseUserConcreteCaseGroupEvaluation.pseConcreteCaseSituationId} />
      <input type="hidden" name="pseConcreteCaseGroupId" value={pseUserConcreteCaseGroupEvaluation.pseConcreteCaseGroupId} />
      <input type="hidden" name="pseConcreteCaseSessionId" value={pseUserConcreteCaseGroupEvaluation.pseConcreteCaseSessionId} />
      <input type="hidden" name="pseConcreteCaseTypeId" value={pseUserConcreteCaseGroupEvaluation.pseConcreteCaseTypeId} />
      <input type="hidden" name="pseSituationConcreteCaseGroupId" value={pseUserConcreteCaseGroupEvaluation.pseSituationConcreteCaseGroupId} />
      <InputHiddenJson name="usersGrades" json={pseUserConcreteCaseUsersGrades} />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Compétences</TableCell>
            {pseUserConcreteCaseGroupEvaluation.students.map((student) => (
              <TableCell 
                key={student.id} 
                align="center"
                sx={{
                  width: 200,
                }}
              >
                {/* TODO: user picture */}
                {student.fullName}
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
          {pseUserConcreteCaseGroupEvaluation.competencesToEvaluate.map((pseCompetence) => (
            <PseCompetenceRow 
              key={pseCompetence.id}
              shouldBeEvaluated={!!pseUserConcreteCaseGroupEvaluation.competencesToEvaluate.find(c => c.id === pseCompetence.id)}
              pseCompetence={pseCompetence} 
              pseUserConcreteCaseUsersGrades={pseUserConcreteCaseUsersGrades}
              onSetGradeForUser={onSetGradeForUser}
            />
          ))}
        </TableBody>
      </Table>
    </FormView>
  );
}
