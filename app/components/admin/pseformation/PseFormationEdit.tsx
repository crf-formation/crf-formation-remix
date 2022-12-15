// see https://marmelab.com/react-admin/Show.html
import { DateInput, FormTab, required, TabbedForm, TextInput } from 'react-admin';
import CrudActionsTabs from '~/components/reactadmin/layout/CrudActionsTabs';
import EditLayout from '~/components/reactadmin/layout/EditLayout';
import { PlaceReferenceInput } from '../PlaceReference';
import { PseFormationUserReferenceInput } from './PseFormationUserReference';
import { FormationStateInput } from './PseFormationState';
import { PseFormationTeacherReferenceInput } from './PseFormationTeacherReference';


export default function PseFormationEdit() {
  // TODO: remove redirect after tests?
  return (
    <EditLayout actions={<CrudActionsTabs variant="edit" />} redirect={false}>
      <TabbedForm>
        <FormTab label="summary" path="summary">
          <TextInput source="id" disabled validate={required()} fullWidth />

          <TextInput
            source="title"
            type="title"
            validate={required()}
            fullWidth
          />

          <PlaceReferenceInput source="placeId" />

          <FormationStateInput source="state" />

          <DateInput
            source="from"
            label="from"
            validate={required()}
            fullWidth
          />

          <DateInput source="to" label="to" validate={required()} fullWidth />
        </FormTab>

        <FormTab label="Students" path="students">
          <PseFormationUserReferenceInput
            label=""
            source="students"
            role="STUDENT"
          />
        </FormTab>

        <FormTab label="Teachers" path="teachers">
          <PseFormationTeacherReferenceInput
            label=""
            source="teachers"
            role="TEACHER"
          />
        </FormTab>
      </TabbedForm>
    </EditLayout>
  );
}
