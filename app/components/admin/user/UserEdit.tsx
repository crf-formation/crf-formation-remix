// see https://marmelab.com/react-admin/Show.html
import { DateTimeInput, required, TextInput } from 'react-admin';
import CrudActionsTabs from '~/components/reactadmin/layout/CrudActionsTabs';
import EditLayout from '~/components/reactadmin/layout/EditLayout';
import SimpleFormLayout from '~/components/reactadmin/layout/SimpleFormLayout';
import UserStateInput from './UserStateInput';



export default function UserEdit() {
  return (
    <EditLayout actions={<CrudActionsTabs variant="edit" disableCreate />}>
      <SimpleFormLayout variant="edit">
        <TextInput source="id" disabled validate={required()} fullWidth />
        <TextInput
          source="email"
          type="email"
          validate={required()}
          fullWidth
        />
        <UserStateInput 
          source="state"
        />
        <TextInput
          source="firstName"
          type="text"
          validate={required()}
          fullWidth
        />
        <TextInput
          source="lastName"
          type="text"
          validate={required()}
          fullWidth
        />

        <DateTimeInput
          source="createdAt"
          label="createdAt"
          disabled
          validate={required()}
          fullWidth
        />
        <DateTimeInput
          source="updatedAt"
          label="updatedAt"
          disabled
          validate={required()}
          fullWidth
        />
        
      </SimpleFormLayout>
    </EditLayout>
  );
}
