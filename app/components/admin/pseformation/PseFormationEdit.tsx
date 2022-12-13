// see https://marmelab.com/react-admin/Show.html
import { DateInput, required, TextInput } from 'react-admin';
import CrudActionsTabs from '~/components/reactadmin/layout/CrudActionsTabs';
import EditLayout from '~/components/reactadmin/layout/EditLayout';
import SimpleFormLayout from '~/components/reactadmin/layout/SimpleFormLayout';
import { PlaceReferenceInput } from '../PlaceReference';
import { PseFormationUserReferenceInput } from './PseFormationUserReference';
import { FormationStateInput } from './PseFormationState';
import { Grid } from '@mui/material';


export default function PseFormationEdit() {
  // TODO: remove redirect after tests?
  return (
    <EditLayout actions={<CrudActionsTabs variant="edit" />} redirect="false">
      <SimpleFormLayout variant="edit">
        <TextInput source="id" disabled validate={required()} fullWidth />

        <TextInput
          source="title"
          type="title"
          validate={required()}
          fullWidth
        />

        <PlaceReferenceInput source="placeId" />

        <FormationStateInput source="state" />

        <DateInput source="from" label="from" validate={required()} fullWidth />

        <DateInput source="to" label="to" validate={required()} fullWidth />

        <Grid container spacing={2}>
          <Grid item md={6}>
            <PseFormationUserReferenceInput
              label="Students"
              source="students"
              role="STUDENT"
            />
          </Grid>
          <Grid item md={6}>
            <PseFormationUserReferenceInput
              label="Teachers"
              source="teachers"
              role="TEACHER"
            />
          </Grid>
        </Grid>
      </SimpleFormLayout>
    </EditLayout>
  );
}
