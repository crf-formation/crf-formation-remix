import { AppBar, Box, Tabs } from "@mui/material";
import type { ReactNode } from "react";

interface AppTabsProps {
  children: ReactNode
  value?: any
}


interface AppTabLabelProps {
	label: string,
	icon?: ReactNode
}

export function AppTabLabel({ label, icon }: AppTabLabelProps) {
	return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {icon && (
        <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>{icon}</Box>
      )}
      <Box sx={{ display: "flex", alignItems: "center" }}>{label}</Box>
    </Box>
  );
}

export default function AppTabs({ value, children }: AppTabsProps) {
	return (
    <AppBar
      color="primary"
      component="div"
      position="sticky"
      elevation={0}
      sx={(theme) => ({
        // top: 'var(--header-height)',
        "& .MuiTabs-root": {
          marginLeft: theme.spacing(1),
        },
        "& .MuiTabs-indicator": {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
        "& .MuiTab-root": {
          textTransform: "none",
          margin: theme.spacing(0, 1),
          minWidth: 0,
          padding: theme.spacing(0, 2),
          [theme.breakpoints.up("md")]: {
            padding: theme.spacing(0, 2),
            minWidth: 0,
          },
        },
        p: 0,
        m: 0,
        mb: 2,
        "& .Mui-selected": {
          // borderBottom: '3px solid white'
        }
      })}
    >
      <Tabs 
        value={value} 
        textColor="inherit"
        allowScrollButtonsMobile
      >
        {children}
      </Tabs>
    </AppBar>
  );
}