import type { DividerProps } from "@mui/material";
import Divider from "@mui/material/Divider";

export default function SidebarDivider(props: DividerProps) {
  return (
    <Divider
      {...props}
      sx={{
        borderColor: "var(--sidebar-divider)",
        ...props.sx
      }}
    />
  );
}