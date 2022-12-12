import { Add } from "@mui/icons-material";
import {
  FunctionField,
  ReferenceField,
  ReferenceInput,
  AutocompleteInput,
  Datagrid,
  ReferenceManyField,
  TextField,
  ArrayInput,
  BooleanInput,
  required,
  SimpleFormIterator,
  TextInput,
  ArrayField,
  BooleanField,
} from "react-admin";
import type { UserOnPseFormationDto } from "~/dto/useronpseformation.dto";
import { Box, Button, Typography } from "@mui/material";
import { UserReferenceInput } from "../UserReference";
import { PseFormationUserStateInput } from "./PseFormationUserState";

interface Props {
  source: string;
}

export function PseFormationUserReferenceField({ source }: Props) {
  return (
    <Box component="section" sx={{ mt: 2 }}>
      <Typography variant="h4">Users</Typography>
      <Box sx={{ mt: 2 }}>
        <ArrayField source="configurations">
          <Datagrid>
            <TextField source="userId" fullWidth />
            <TextField source="user.firstName" fullWidth />
            <BooleanField source="user.lastName" fullWidth />
          </Datagrid>
        </ArrayField>
      </Box>
    </Box>
  );
}

export function PseFormationUserReferenceInput({ source }: Props) {
  return (
    <Box
      sx={{
        width: "100%",
        paddingBottom: 4,

        "& .RaSimpleFormIterator-line": {
          width: "100%",
          paddingTop: 4,
          paddingBottom: 2,
        },
      }}
    >
      <ArrayInput source="users">
        <SimpleFormIterator
          inline
          addButton={
            <Button variant="outlined" endIcon={<Add />}>
              Add
            </Button>
          }
        >
          <UserReferenceInput source="userId" validate={required()} />

          <PseFormationUserStateInput
            source="type"
          />
        </SimpleFormIterator>
      </ArrayInput>
    </Box>
  );
}
