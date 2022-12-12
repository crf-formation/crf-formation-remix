import { Add } from '@mui/icons-material';
import { FunctionField, ReferenceField, ReferenceInput, AutocompleteInput, Datagrid, ReferenceManyField, TextField, ArrayInput, BooleanInput, required, SimpleFormIterator, TextInput, ArrayField, BooleanField } from 'react-admin';
import type { UserOnPseFormationDto } from '~/dto/useronpseformation.dto';
import { Box, Button, Typography } from '@mui/material';
import { UserReferenceInput } from './UserReference';

interface Props {
  source: string
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

// export function PseFormationUserReferenceInput({ source }: Props) {
// 	return (
//     <ReferenceManyField reference="pse-user" target="formationId" label="Users on formation">
//       <Datagrid>
//         <TextField source="id" />
//         <TextField source="user.firstName" />
//         <TextField source="user.lastName" />
//       </Datagrid>
//     </ReferenceManyField>
//   );
// }

export function PseFormationUserReferenceInput({ source }: Props) {
	return (
    <Box
      sx={{
        width: "100%",

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
          <UserReferenceInput source="UserId" validate={required()} />
          {/* TODO: type */}
          <TextInput source="type" defaultValue="STUDENT" fullWidth validate={required()} />

        </SimpleFormIterator>
      </ArrayInput>
    </Box>
  );
}