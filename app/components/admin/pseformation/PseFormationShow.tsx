// see https://marmelab.com/react-admin/Show.html
import { DateField, EmailField, SimpleShowLayout, TextField } from 'react-admin';
import CrudActionsTabs from '~/components/reactadmin/layout/CrudActionsTabs';
import ShowLayout from '~/components/reactadmin/layout/ShowLayout';
import { PlaceReferenceField } from '../PlaceReference';
import { FormationStateField } from './PseFormationState';

export default function PseFormationShow() {
  return (
    <ShowLayout actions={<CrudActionsTabs variant="show" />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <EmailField source="email" />

        <FormationStateField source="state" />

        <PlaceReferenceField source="placeId" />

        <DateField source="from" />
        <DateField source="to" />

        <DateField source="createdAt" showTime />
        <DateField source="updatedAt" showTime />
      </SimpleShowLayout>
    </ShowLayout>
  );
}