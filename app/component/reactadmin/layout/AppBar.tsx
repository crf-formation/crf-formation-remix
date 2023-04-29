// https://marmelab.com/react-admin/Layout.html
import type { AppBarProps } from "react-admin";

// We do not want an app bar react-admin, we will handle it manually on our app bar
export default function AdminAppBar({ open, ...props }: AppBarProps) {
  return <span />;
  // (
  //   <ReactAdminAppBar
  //     color="primary"
  //     sx={{
  //       position: "relative",

  //       "& .RaAppBar-title": {
  //         flex: 1,
  //         textOverflow: "ellipsis",
  //         whiteSpace: "nowrap",
  //         overflow: "hidden",
  //       },
  //     }}
  //     {...props}
  //   >
  //     <Typography variant="h6" color="inherit" id="react-admin-title" />
  // 		<Box sx={{ display: "flex", flex: 1}} />
  //   </ReactAdminAppBar>
  // );
}