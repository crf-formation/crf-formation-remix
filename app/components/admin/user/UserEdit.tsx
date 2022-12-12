// see https://marmelab.com/react-admin/Show.html
import { DateInput, DateTimeInput, required, TextInput } from 'react-admin';
import CrudActionsTabs from '~/components/reactadmin/layout/CrudActionsTabs';
import EditLayout from '~/components/reactadmin/layout/EditLayout';
import SimpleFormLayout from '~/components/reactadmin/layout/SimpleFormLayout';
import type { UserPutDto } from '~/dto/user.dto';
import UserStateInput from './UserStateInput';

export function toUserPutDto(data: any): UserPutDto {
	return {
		firstName: data.firstName,
		lastName: data.firstName,
		email: data.firstName,
		state: data.state,
	};
}

export default function UserEdit() {
  return (
    <EditLayout actions={<CrudActionsTabs variant="edit" disableCreate />} mapper={toUserPutDto}>
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
