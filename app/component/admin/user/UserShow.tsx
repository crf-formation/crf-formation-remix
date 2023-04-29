// see https://marmelab.com/react-admin/Show.html
import { DateField, EmailField, SimpleShowLayout, TextField } from "react-admin";
import CrudActionsTabs from "~/component/reactadmin/layout/CrudActionsTabs";
import ShowLayout from "~/component/reactadmin/layout/ShowLayout";
import { UserRoleField } from "./UserRole";
import { UserStateField } from "./UserState";

export default function UserShow() {
  return (
    <ShowLayout actions={<CrudActionsTabs variant="show" disableCreate />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <EmailField source="email" />

        <UserStateField source="state" />
        <UserRoleField source="role" />

        <TextField source="firstName" />
        <TextField source="lastName" />

        <DateField source="createdAt" showTime />
        <DateField source="updatedAt" showTime />
      </SimpleShowLayout>
    </ShowLayout>
  );
}