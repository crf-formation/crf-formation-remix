import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ListIcon from "@mui/icons-material/List";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Tab from "@mui/material/Tab";
import { useRecordContext, useRedirect, useResourceContext } from "react-admin";
import AppTabs, { AppTabLabel } from "~/component/layout/AppTabs";

type ActionsTabsVariant = "show" | "edit" | "list" | "create";


interface ActionsTabsProps {
  variant: ActionsTabsVariant;
  disableList?: boolean;
  disableCreate?: boolean;
  disableShow?: boolean;
}

export default function CrudActionsTabs(
  {
    variant,
    disableList,
    disableCreate,
    disableShow
  }: ActionsTabsProps) {
  const redirect = useRedirect();
  const resource = useResourceContext();
  const record = useRecordContext();
  // const getResourceLabel = useGetResourceLabel();

  const isForRecord = variant === "edit" || variant === "show";

  const tabs = [
    !disableList && "list",
    !disableCreate && "create",
    !disableShow && isForRecord && "show",
    isForRecord && "edit"
  ].filter(Boolean);

  return (
    <AppTabs value={tabs.indexOf(variant)}>
      {tabs.indexOf("list") !== -1 && (
        <Tab
          label={<AppTabLabel icon={<ListIcon />} label="List" />}
          onClick={() => redirect("list", resource)}
        />
      )}

      {tabs.indexOf("create") !== -1 && (
        <Tab
          label={<AppTabLabel icon={<AddIcon />} label="Create" />}
          onClick={() => redirect("create", resource)}
        />
      )}

      {tabs.indexOf("show") !== -1 && (
        <Tab
          label={<AppTabLabel icon={<VisibilityIcon />} label="Detail" />}
          onClick={() => redirect("show", resource, record?.id)}
        />
      )}

      {tabs.indexOf("edit") !== -1 && (
        <Tab
          label={<AppTabLabel icon={<EditIcon />} label="Edit" />}
          onClick={() => redirect("edit", resource, record?.id)}
        />
      )}
    </AppTabs>
  );
}
