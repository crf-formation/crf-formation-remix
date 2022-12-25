import { Box, Typography } from '@mui/material';
import type { PseCompetenceDto } from "~/dto/psecompetence.dto";
import type { PseConcreteCaseGroupDto } from "~/dto/pseconcretecasegroup.dto";
import type { PseConcreteCaseSituationDto } from "~/dto/pseconcretecasesituation.dto";
import { PseUserConcreteCaseCompetenceGradeZEnum } from "~/dto/pseuserconcretecase.dto";
import { pseConcreteCaseSituationGroupEvaluatePostDtoValidator } from "~/form/pseuserconcretecase.form";
import FormView from "../form/FormView";

interface Props {
  pseConcreteCaseGroup: PseConcreteCaseGroupDto;
  pseConcreteCaseSituation: PseConcreteCaseSituationDto;
  pseCompetences: Array<PseCompetenceDto>;
}

export default function PseConcreteCaseSituationEvaluateGroupForm({
  pseConcreteCaseGroup,
  pseConcreteCaseSituation,
  pseCompetences,
}: Props) {
  return (
    <FormView
      submitText="Sauvegarder"
      validator={pseConcreteCaseSituationGroupEvaluatePostDtoValidator}
    >
      {pseConcreteCaseGroup.students.map((student) => (
        <div key={student.id}>
          <Typography variant="h5">{student.user.fullName}</Typography>
        </div>
      ))}
      {pseCompetences.map((pseCompetence) => {
        const competenceToEvaluate =
          pseConcreteCaseSituation.pseConcreteCaseType.competencesToEvaluate.find(
            (competenceToEvaluate) =>
              competenceToEvaluate.id === pseCompetence.id
          );

        if (!competenceToEvaluate) {
          // TODO: input hidden?
          return null;
        }
        return (
          <>
            <div key={competenceToEvaluate.id}>
              <Typography variant="h4">{competenceToEvaluate.id}</Typography>

              {pseConcreteCaseGroup.students.map((student) => (
                <div key={student.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    {PseUserConcreteCaseCompetenceGradeZEnum.options.map(
                      (option) => (
                        <Box key={option} sx={{ minWidth: 32 }}>{option}</Box>
                      )
                    )}
                  </Box>
                </div>
              ))}
            </div>
          </>
        );
      })}
    </FormView>
  );
}
