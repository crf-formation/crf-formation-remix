import { Box, Card, CardContent, Divider } from "@mui/material";
import { Datagrid, DateField, TextField } from "react-admin";
import CrudActionsTabs from '~/components/reactadmin/layout/CrudActionsTabs';
import ListLayout from '~/components/reactadmin/layout/ListLayout';
import { PlaceReferenceField } from "../PlaceReference";
import { FormationStateField } from "./PseFormationState";

export default function PseFormationList() {
  return (
    <ListLayout
      title="Formations"
      actions={<CrudActionsTabs variant="list" />}
    >
      <Datagrid rowClick="edit" bulkActionButtons={false}>
        {/* <TextField source="id" /> */}

        <TextField source="title" />

        <FormationStateField source="state" />

        <PlaceReferenceField source="placeId" />

        <DateField source="from" />
        <DateField source="to" />

        <DateField source="createdAt" showTime />
        <DateField source="updatedAt" showTime />
      </Datagrid>
    </ListLayout>
  );
}
