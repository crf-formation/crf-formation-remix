// see https://marmelab.com/react-admin/Show.html
import { DateInput, TextInput, required } from 'react-admin';
import CreateLayout from '~/component/reactadmin/layout/CreateLayout';
import CrudActionsTabs from '~/component/reactadmin/layout/CrudActionsTabs';
import SimpleFormLayout from '~/component/reactadmin/layout/SimpleFormLayout';
import { PlaceReferenceInput } from '../PlaceReference';
import { FormationStateInput } from './PseFormationState';

export default function PseFormationCreate() {
  return (
    <CreateLayout actions={<CrudActionsTabs variant="create" />}>
      <SimpleFormLayout variant="create">
        <TextInput
          source="title"
          type="title"
          validate={required()}
          fullWidth
        />

        <FormationStateInput source="state" />
        
        <PlaceReferenceInput source="placeId" />

        <DateInput
          source="from"
          label="from"
          validate={required()}
          fullWidth
        />

        <DateInput
          source="to"
          label="to"
          validate={required()}
          fullWidth
        />

      </SimpleFormLayout>
    </CreateLayout>
  );
}
