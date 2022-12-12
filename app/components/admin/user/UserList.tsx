import { Box, Card, CardContent, Divider } from "@mui/material";
import { Datagrid, DateField, EmailField, TextField } from "react-admin";
import CrudActionsTabs from '~/components/reactadmin/layout/CrudActionsTabs';
import ListLayout from '~/components/reactadmin/layout/ListLayout';
import { UserRoleField } from "./UserRole";
import { UserStateField } from "./UserState";


function Sidebar() {
  return (
    <Card sx={{ mr: 2, mt: 0, width: 200 }}>
      <CardContent>

        <Box my={2}>
          <Divider />
        </Box>

        <Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function UserList() {
  return (
    <ListLayout
      title="Users"
      aside={<Sidebar />}
      actions={<CrudActionsTabs variant="list" disableCreate />}
    >
      <Datagrid rowClick="edit" bulkActionButtons={false}>
        {/* <TextField source="id" /> */}
        <EmailField source="email" />
        <TextField source="firstName" />
        <TextField source="lastName" />

        <UserStateField source="state" />
        <UserRoleField source="role" />

        <DateField source="createdAt" showTime />
        <DateField source="updatedAt" showTime />
      </Datagrid>
    </ListLayout>
  );
}
