import Add from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ArrayField, ArrayInput, BooleanField, Datagrid, SimpleFormIterator, TextField } from "react-admin";
import { TeacherReferenceInput } from "../TeacherReference";

interface Props {
  source: string;
  label: string;
}

export function PseFormationTeacherReferenceField({ source }: Props) {
  return (
    <Box component="section" sx={{ mt: 2 }}>
      <Typography variant="h4">Formateurs</Typography>
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

export function PseFormationTeacherReferenceInput({ label, source }: Props) {
  return (
    <Box
      sx={{
        width: "100%",
        paddingBottom: 4,

        "& .RaSimpleFormIterator-line": {
          width: "100%",
          minWidth: 320,
          maxWidth: 640,
          paddingTop: 4,
          paddingBottom: 2
        },

        "& .RaSimpleFormIterator-form": {
          width: "100%"
        }
      }}
    >
      <ArrayInput source={source} label={label}>
        <SimpleFormIterator
          inline
          addButton={
            <Button variant="outlined" endIcon={<Add />}>
              Add
            </Button>
          }
        >
          <TeacherReferenceInput source="id" />
        </SimpleFormIterator>
      </ArrayInput>
    </Box>
  );
}
