// see https://marmelab.com/react-admin/Show.html
import { DateField, EmailField, SimpleShowLayout, TextField } from 'react-admin';
import CrudActionsTabs from '~/components/reactadmin/layout/CrudActionsTabs';
import ShowLayout from '~/components/reactadmin/layout/ShowLayout';

export default function UserShow() {
  return (
    <ShowLayout actions={<CrudActionsTabs variant="show" disableCreate />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <EmailField source="email" />
        <TextField source="state" />

        <TextField source="firstName" />
        <TextField source="lastName" />

        <DateField source="createdAt" showTime />
        <DateField source="updatedAt" showTime />
      </SimpleShowLayout>
    </ShowLayout>
  );
}