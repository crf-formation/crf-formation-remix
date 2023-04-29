import { Chip } from "@mui/material";
import type { PseFormationStateDtoEnum } from "~/dto/pseformation.dto";


interface Props {
  state: PseFormationStateDtoEnum;
}

export default function FormationPseStatusChip({ state }: Props) {
  return <Chip label={state} />;
}