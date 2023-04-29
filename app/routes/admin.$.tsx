// https://marmelab.com/react-admin/Remix.html
// https://marmelab.com/react-admin/Tutorial.html
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Admin, Resource } from "react-admin";
import AdminMenu from "~/component/admin/AdminMenu";
import PseFormationCreate from "~/component/admin/pseformation/PseFormationCreate";
import PseFormationEdit from "~/component/admin/pseformation/PseFormationEdit";
import PseFormationList from "~/component/admin/pseformation/PseFormationList";
import PseFormationShow from "~/component/admin/pseformation/PseFormationShow";
import UserEdit from "~/component/admin/user/UserEdit";
import UserList from "~/component/admin/user/UserList";
import UserShow from "~/component/admin/user/UserShow";
import Main from "~/component/layout/Main";
import Layout from "~/component/reactadmin/layout/Layout";
import useTheme from "~/hook/useTheme";
import { requireAdmin } from "~/service/session.server";
import dataProvider from "~/util/dataProvider";

export async function loader({ request }: LoaderArgs) {
  await requireAdmin(request);

  return json({
  });
}

export const meta: V2_MetaFunction<typeof loader> = () => {
  return [
    { title: "Admin" },
  ];
};

export default function AdminRoute() {
  const theme = useTheme();

  return (
    <Main>
      <Admin
        title="Admin"
        basename="/admin"
        menu={AdminMenu}
        dataProvider={dataProvider("/api")}
        theme={theme}
        layout={Layout}
      >
        <Resource
          name="user"
          list={UserList}
          show={UserShow}
          edit={UserEdit}
        />

        <Resource
          name="pse"
          list={PseFormationList}
          show={PseFormationShow}
          edit={PseFormationEdit}
          create={PseFormationCreate}
        />

        {/* Resources with no form, referenced on other forms */}
        <Resource name="pse-user" />
        <Resource name="place" />
        
      </Admin>
    </Main>
  );
}
