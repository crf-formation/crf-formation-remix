import { alpha, styled } from '@mui/material/styles';
import type { ReactNode } from "react";

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '~/component/icons/InfoOutlined';

export type Severity = 'info' | 'warning' | 'error' | 'success'

interface Props {
	severity: Severity
	className?: string
	children: ReactNode
	withIcon?: boolean
}

const icons: {[key in Severity]: ReactNode} = {
	info: <InfoOutlinedIcon />,
	warning: <WarningAmberIcon />,
	error: <ErrorOutlineIcon />,
  success: <CheckCircleOutlineIcon />
}

function Callout({ severity = 'info', className, withIcon = false, children }: Props) {
	return (
    <aside className={`MuiCallout-root MuiCallout-${severity} ${className}`}>
      {withIcon && <div className="MuiCallout-icon">{icons[severity]}</div>}
      <div>{children}</div>
    </aside>
  );
}

const StyledCallout = styled(Callout)(({ theme, sx }) => ({
  padding: "16px",
  margin: "16px 0",
  border: "1px solid",
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  alignItems: "flex-start",

  ...sx,

  "& > p": {
    color: "inherit",
    "&:last-child": {
      margin: 0,
    },
  },

  "& ul, li": {
    color: "inherit",
  },

  "& .MuiCallout-icon": {
    marginRight: theme.spacing(1),
    display: "flex",
    alignItems: "center",
  },

  "&.MuiCallout-error": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.error[50] ?? "#fff"
        : theme.palette.error[900] ?? theme.palette.text.primary,
    backgroundColor:
      theme.palette.mode === "dark"
        ? // Support Material Design theme
          alpha(theme.palette.error[900] ?? theme.palette.error.dark, 0.35)
        : theme.palette.error[50] ?? theme.palette.error.light,
    borderColor:
      theme.palette.mode === "dark" // Support Material Design theme
        ? theme.palette.error[800] ?? theme.palette.error.dark
        : theme.palette.error[200] ?? theme.palette.error.light,
    "& strong": {
      color:
        theme.palette.mode === "dark"
          ? theme.palette.error[100] ?? "#fff"
          : theme.palette.error[800] ?? theme.palette.text.primary,
    },
    "& a": {
      color:
        theme.palette.mode === "dark"
          ? theme.palette.error[100] ?? "#fff"
          : theme.palette.error[800] ?? theme.palette.text.primary,
      textDecorationColor: alpha(theme.palette.error.main, 0.4),
      "&:hover": {
        textDecorationColor: "inherit",
      },
    },
  },

  // TODO: replace primary by blue?
  "&.MuiCallout-info": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.primary[50] ?? "#fff"
        : theme.palette.primary[900] ?? theme.palette.text.primary,
    backgroundColor:
      theme.palette.mode === "dark"
        ? // Support Material Design theme
          alpha(theme.palette.primary[900] ?? theme.palette.primary.dark, 0.2)
        : alpha(theme.palette.primary[50] ?? theme.palette.primary.dark, 0.8),
    borderColor:
      theme.palette.mode === "dark" // Support Material Design theme
        ? theme.palette.primary[800] ?? theme.palette.primary.dark
        : theme.palette.primary[100] ?? theme.palette.primary.light,
    "& strong": {
      color:
        theme.palette.mode === "dark"
          ? theme.palette.primary[100] ?? "#fff"
          : theme.palette.primary[800] ?? theme.palette.text.primary,
    },
  },

  "&.MuiCallout-warning": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.warning[50] ?? "#fff"
        : theme.palette.grey[900] ?? theme.palette.text.primary,
    backgroundColor:
      theme.palette.mode === "dark"
        ? // Support Material Design theme
          alpha(theme.palette.warning[900] ?? theme.palette.warning.dark, 0.35)
        : alpha(theme.palette.warning[50] ?? theme.palette.warning.light, 0.6),
    borderColor:
      theme.palette.mode === "dark" // Support Material Design theme
        ? theme.palette.warning[800] ?? theme.palette.warning.dark
        : theme.palette.warning[300] ?? theme.palette.warning.light,
    "& strong": {
      color:
        theme.palette.mode === "dark"
          ? theme.palette.warning[100] ?? "#fff"
          : theme.palette.warning[800] ?? theme.palette.text.primary,
    },
    "& a": {
      color:
        theme.palette.mode === "dark"
          ? theme.palette.warning[100] ?? "#fff"
          : theme.palette.warning[800] ?? theme.palette.text.primary,
      textDecorationColor: alpha(theme.palette.warning.main, 0.4),
      "&:hover": {
        textDecorationColor: "inherit",
      },
    },
  },

  "&.MuiCallout-success": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.success[50] ?? "#fff"
        : theme.palette.grey[900] ?? theme.palette.text.primary,
    backgroundColor:
      theme.palette.mode === "dark"
        ? // Support Material Design theme
          alpha(theme.palette.success[900] ?? theme.palette.success.dark, 0.35)
        : alpha(theme.palette.success[50] ?? theme.palette.success.light, 0.6),
    borderColor:
      theme.palette.mode === "dark" // Support Material Design theme
        ? theme.palette.success[800] ?? theme.palette.success.dark
        : theme.palette.success[300] ?? theme.palette.success.light,
    "& strong": {
      color:
        theme.palette.mode === "dark"
          ? theme.palette.success[100] ?? "#fff"
          : theme.palette.success[800] ?? theme.palette.text.primary,
    },
    "& a": {
      color:
        theme.palette.mode === "dark"
          ? theme.palette.success[100] ?? "#fff"
          : theme.palette.success[800] ?? theme.palette.text.primary,
      textDecorationColor: alpha(theme.palette.success.main, 0.4),
      "&:hover": {
        textDecorationColor: "inherit",
      },
    },
  },

}));

export default StyledCallout