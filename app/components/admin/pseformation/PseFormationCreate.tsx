// see https://marmelab.com/react-admin/Show.html
import { DateInput, required, TextInput } from 'react-admin';
import CrudActionsTabs from '~/components/reactadmin/layout/CrudActionsTabs';
import CreateLayout from '~/components/reactadmin/layout/CreateLayout';
import SimpleFormLayout from '~/components/reactadmin/layout/SimpleFormLayout';
import { FormationStateInput } from './PseFormationState';
import { PlaceReferenceInput } from '../PlaceReference';

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
