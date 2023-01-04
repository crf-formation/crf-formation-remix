import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { sortBy } from "lodash";
import { useState } from "react";
import { v4 as uuid } from 'uuid';
import type { PseConcreteCaseGroupDto } from "~/dto/pseconcretecasegroup.dto";
import type { PseSituationConcreteCaseGroupDto } from "~/dto/pseconcretecasesituation.dto";
import { deleteObjectOnArray, moveObjectAtIndexOnArray } from "~/util/array";
import FormErrorHelperText from '../form/FormErrorHelperText';
import InputHiddenJson from '../form/InputHiddenJson';
import Callout from "../typography/Callout";


interface Props {
	name: string;
	pseConcreteCaseGroups: Array<PseConcreteCaseGroupDto>;
	pseSituationConcreteCaseGroups?: Array<PseSituationConcreteCaseGroupDto>;
}

export default function OrderPseConcreteCaseGroups({ name, pseConcreteCaseGroups, pseSituationConcreteCaseGroups }: Props) {
	const [state, setState ] = useState<Array<PseSituationConcreteCaseGroupDto>>(pseSituationConcreteCaseGroups || [])

	const notOrdered: Array<PseSituationConcreteCaseGroupDto> = pseConcreteCaseGroups
		.filter(pseConcreteCaseGroup => !state.find((pseSituationConcreteCaseGroup: PseSituationConcreteCaseGroupDto) => pseSituationConcreteCaseGroup.pseConcreteCaseGroupId === pseConcreteCaseGroup.id))
		.map(pseConcreteCaseGroup => {
			return {
        id: uuid(),
        pseConcreteCaseGroup: pseConcreteCaseGroup,
        pseConcreteCaseGroupId: pseConcreteCaseGroup.id,
      } as PseSituationConcreteCaseGroupDto;
	})

	const ordered: Array<PseSituationConcreteCaseGroupDto> = sortBy(
		state, 
		(pseSituationConcreteCaseGroupDto: PseSituationConcreteCaseGroupDto) => pseSituationConcreteCaseGroupDto?.position)

  if (pseConcreteCaseGroups?.length === 0) {
    return (
      <Box mt={2}>
        <Callout severity="info">
          Créez un groupe pour pouvoir définir un ordre de passage.
        </Callout>
      </Box>
    );
  }

	return (
    <>
      <Box mt={2}>
        <Typography variant="h4">Order de passage des groupes</Typography>

        <FormErrorHelperText name={name} />

        {ordered.length === 0 && (
          <Callout severity="info">
            Ajoutez des groupes pour définir un ordre de passage.
          </Callout>
        )}

        <InputHiddenJson
          name={name}
          json={ordered.map((group) => ({
            id: group.id,
            position: group.position,
            pseConcreteCaseGroupId: group.pseConcreteCaseGroupId,
          }))}
        />

        <Stack spacing={2} mt={2}>
          {ordered.map(
            (
              pseSituationConcreteCaseGroup: PseSituationConcreteCaseGroupDto,
              index: number
            ) => (
              <OrderedGroupLine
                key={pseSituationConcreteCaseGroup.pseConcreteCaseGroup.id}
                index={index}
                name={name}
                pseSituationConcreteCaseGroup={pseSituationConcreteCaseGroup}
                isFirst={pseSituationConcreteCaseGroup.position === 1}
                isLast={
                  pseSituationConcreteCaseGroup.position === ordered.length
                }
                onRemove={() => {
                  let updated = deleteObjectOnArray(
                    state,
                    (other: PseSituationConcreteCaseGroupDto) =>
                      other.id === pseSituationConcreteCaseGroup.id
                  );

                  // update position
                  updated = updated.map(
                    (
                      pseSituationConcreteCaseGroupDto: PseSituationConcreteCaseGroupDto,
                      index: number
                    ) => {
                      return {
                        ...pseSituationConcreteCaseGroupDto,
                        position: index + 1,
                      };
                    }
                  );

                  setState(updated);
                }}
                onUp={() => {
                  // already first
                  if (pseSituationConcreteCaseGroup.position === 1) {
                    return;
                  }

                  let updated = moveObjectAtIndexOnArray(
                    state,
                    {
                      ...pseSituationConcreteCaseGroup,
                      position: pseSituationConcreteCaseGroup.position - 1,
                    },
                    pseSituationConcreteCaseGroup.position - 1,
                    (other: PseSituationConcreteCaseGroupDto) =>
                      other.id === pseSituationConcreteCaseGroup.id
                  );

                  // update position
                  updated = updated.map(
                    (
                      pseSituationConcreteCaseGroupDto: PseSituationConcreteCaseGroupDto,
                      index
                    ) => {
                      return {
                        ...pseSituationConcreteCaseGroupDto,
                        position: index + 1,
                      };
                    }
                  );

                  setState(updated);
                }}
                onDown={() => {
                  // already last
                  if (
                    pseSituationConcreteCaseGroup.position === ordered.length
                  ) {
                    return;
                  }

                  let updated = moveObjectAtIndexOnArray(
                    state,
                    {
                      ...pseSituationConcreteCaseGroup,
                      position: pseSituationConcreteCaseGroup.position + 1,
                    },
                    pseSituationConcreteCaseGroup.position + 1,
                    (other: PseSituationConcreteCaseGroupDto) =>
                      other.id === pseSituationConcreteCaseGroup.id
                  );

                  // update position
                  updated = updated.map(
                    (
                      pseSituationConcreteCaseGroupDto: PseSituationConcreteCaseGroupDto,
                      index: number
                    ) => {
                      return {
                        ...pseSituationConcreteCaseGroupDto,
                        position: index + 1,
                      };
                    }
                  );

                  setState(updated);
                }}
              />
            )
          )}
        </Stack>
      </Box>

      <Box my={2}>
        <Divider />
      </Box>

      <Box mt={2}>
        <Typography variant="h4">
          Groupes non configurés pour cette situation
        </Typography>
        <Stack spacing={2} mt={2}>
          {notOrdered.map(
            (
              pseSituationConcreteCaseGroup: PseSituationConcreteCaseGroupDto
            ) => (
              <NotOrderedGroupLine
                key={pseSituationConcreteCaseGroup.pseConcreteCaseGroup.id}
                pseSituationConcreteCaseGroup={pseSituationConcreteCaseGroup}
                onAdd={() => {
                  setState([
                    ...state,
                    {
                      ...pseSituationConcreteCaseGroup,
                      position: ordered.length + 1,
                    },
                  ]);
                }}
              />
            )
          )}
        </Stack>
      </Box>
    </>
  );
}

function OrderedGroupLine({ index, name, pseSituationConcreteCaseGroup, isFirst, isLast, onUp, onDown, onRemove }) {
	return (
    <>
      <Box display="flex" justifyContent="space-between" px={2}>
        <div>{pseSituationConcreteCaseGroup.pseConcreteCaseGroup.name}</div>
        <div>
          <Button onClick={onRemove}>
            <RemoveIcon />
          </Button>

          <Button onClick={onUp} disabled={isFirst}>
            <ArrowDropUpIcon />
          </Button>
          <Button onClick={onDown} disabled={isLast}>
            <ArrowDropDownIcon />
          </Button>
        </div>
      </Box>
    </>
  );
}

function NotOrderedGroupLine({ pseSituationConcreteCaseGroup, onAdd }) {
	return (
		<Box display="flex" justifyContent="space-between" px={2}>
			<div>{pseSituationConcreteCaseGroup.pseConcreteCaseGroup.name}</div>
			<div>
				<Button onClick={() => onAdd()}>Ajouter</Button>
			</div>
		</Box>
	)
}