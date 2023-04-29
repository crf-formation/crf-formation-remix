import { Grid, Stack } from "@mui/material";
import { useRef } from "react";
import Section from "~/component/layout/Section";
import type { PseConcreteCaseGroupDto } from "~/dto/pseconcretecasegroup.dto";
import type { PseSituationConcreteCaseGroupDto } from "~/dto/pseconcretecasesituation.dto";
import type { PseConcreteCaseTypeDto } from "~/dto/pseconcretecasetype.dto";
import type { UserDto } from "~/dto/user.dto";
import {
  pseConcreteCaseSituationPostDtoValidator,
  pseConcreteCaseSituationPutDtoValidator
} from "~/form/pseconcretecasesituation.form";
import useFormFocusError from "~/hook/useFormFocusError";
import { generateAria } from "~/util/form";
import FormErrorHelperText from "../form/FormErrorHelperText";
import FormView from "../form/FormView";
import FormationTeacherAutocomplete from "../formationpse/FormationTeacherAutocomplete";
import PseConcreteCaseTypeAutocomplete from "../formationpse/PseConcreteCaseTypeAutocomplete";
import OrderPseConcreteCaseGroups from "./OrderPseConcreteCaseGroups";

interface Props<T> {
  pseFormationId: string;
  pseConcreteCaseSessionId: string;
  pseConcreteCaseGroups: Array<PseConcreteCaseGroupDto>;
  actionData: T;
  // edit data
  isEdit?: boolean;
  pseConcreteCaseType?: PseConcreteCaseTypeDto;
  pseSituationConcreteCaseGroups?: Array<PseSituationConcreteCaseGroupDto>;
  teacher?: UserDto;
}

export default function PseConcreteCaseSituationForm<T>(
  {
    pseFormationId,
    pseConcreteCaseSessionId,
    pseConcreteCaseGroups,
    actionData,
    // edit data
    isEdit,
    teacher,
    pseConcreteCaseType,
    pseSituationConcreteCaseGroups
  }: Props<T>) {
  const nameRef = useRef<HTMLInputElement>(null);

  useFormFocusError(actionData, [
    ["name", nameRef]
  ]);

  return (
    <FormView
      submitText={
        isEdit ? <span>Mettre à jour</span> : <span>Créer la situation</span>
      }
      validator={
        isEdit
          ? pseConcreteCaseSituationPutDtoValidator
          : pseConcreteCaseSituationPostDtoValidator
      }
    >
      <input
        type="hidden"
        name="pseConcreteCaseSessionId"
        value={pseConcreteCaseSessionId}
      />

      <Grid container spacing={2}>
        <Grid item md={6}>
          <Section sx={{ flex: 1 }} title="Configuration de la situation">
            <Stack spacing={4}>
              <FormationTeacherAutocomplete
                formationId={pseFormationId}
                defaultValue={teacher}
                name="teacherId"
                {...generateAria(actionData, "teacherId")}
              />
              <FormErrorHelperText name="teacherId" actionData={actionData} />

              <PseConcreteCaseTypeAutocomplete
                defaultValue={pseConcreteCaseType}
                multiple={false}
                name="pseConcreteCaseTypeId"
                {...generateAria(actionData, "pseConcreteCaseTypeId")}
              />
              <FormErrorHelperText
                name="pseConcreteCaseTypeId"
                actionData={actionData}
              />
            </Stack>
          </Section>
        </Grid>

        <Grid item md={6}>
          <Section title="Ordre de passage des groupes">
            <OrderPseConcreteCaseGroups
              name="pseSituationConcreteCaseGroups"
              pseConcreteCaseGroups={pseConcreteCaseGroups}
              pseSituationConcreteCaseGroups={pseSituationConcreteCaseGroups}
            />
          </Section>
        </Grid>
      </Grid>
    </FormView>
  );
}