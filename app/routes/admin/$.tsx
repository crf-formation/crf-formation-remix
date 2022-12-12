// https://marmelab.com/react-admin/Remix.html
// https://marmelab.com/react-admin/Tutorial.html
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Admin, Resource } from "react-admin";
import Main from "~/components/layout/Main";
import Layout from "~/components/reactadmin/layout/Layout";
import UserEdit from "~/components/admin/user/UserEdit";
import UserList from "~/components/admin/user/UserList";
import UserShow from "~/components/admin/user/UserShow";
import PseFormationCreate from "~/components/admin/pseformation/PseFormationCreate";
import PseFormationEdit from "~/components/admin/pseformation/PseFormationEdit";
import PseFormationList from "~/components/admin/pseformation/PseFormationList";
import PseFormationShow from "~/components/admin/pseformation/PseFormationShow";
import AdminMenu from "~/components/admin/AdminMenu";
import useTheme from "~/hooks/useTheme";
import { requireAdmin } from "~/services/session.server";
import dataProvider from "~/utils/dataProvider";

export async function loader({ request }: LoaderArgs) {
  await requireAdmin(request);

  return json({
  });
}

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "ZDP admin",
  };
};

export default function AdminPage() {
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
          name="users"
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

        <Resource name="place" />
      </Admin>
    </Main>
  );
}
