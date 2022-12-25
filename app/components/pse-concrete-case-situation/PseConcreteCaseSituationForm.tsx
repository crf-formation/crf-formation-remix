import { Button } from "@mui/material";
import { useRef } from "react";
import type { PseConcreteCaseGroupDto } from "~/dto/pseconcretecasegroup.dto";
import type { PseSituationConcreteCaseGroupDto } from '~/dto/pseconcretecasesituation.dto';
import type { PseConcreteCaseTypeDto } from '~/dto/pseconcretecasetype.dto';
import type { UserDto } from "~/dto/user.dto";
import useFormFocusError from "~/hooks/useFormFocusError";
import { generateAria } from "~/utils/form";
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

export default function PseConcreteCaseSituationForm<T>({
  pseFormationId,
  pseConcreteCaseSessionId,
  pseConcreteCaseGroups,
  actionData,
  // edit data
  isEdit,
  teacher,
  pseConcreteCaseType,
  pseSituationConcreteCaseGroups,
}: Props<T>) {
  const nameRef = useRef<HTMLInputElement>(null);

  useFormFocusError(actionData, [
    [ "name", nameRef ],
  ]);

  return (
    <FormView
      action={
        <Button type="submit" variant="contained" color="primary">
          {isEdit ? <span>Mettre à jour</span> : <span>Créer la situation</span>}
        </Button>
      }
    >
      <input
        type="hidden"
        name="pseConcreteCaseSessionId"
        value={pseConcreteCaseSessionId}
      />

      <FormationTeacherAutocomplete
        formationId={pseFormationId}
        defaultValue={teacher}
        multiple={false}
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

      <OrderPseConcreteCaseGroups 
        name="pseSituationConcreteCaseGroups" 
        pseConcreteCaseGroups={pseConcreteCaseGroups} 
        pseSituationConcreteCaseGroups={pseSituationConcreteCaseGroups} 
      />

      <FormErrorHelperText name="pseConcreteCaseTypeId" actionData={actionData} />
    </FormView>
  );
}