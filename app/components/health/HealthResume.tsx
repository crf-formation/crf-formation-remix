import { alpha, Box, styled } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { ReactNode } from "react";

type HealthSeverity = 'good' | 'warning' | 'error'

const icons: {[key in HealthSeverity]: ReactNode} = {
	warning: <WarningAmberIcon />,
	error: <ErrorOutlineIcon />,
  good: <CheckCircleOutlineIcon />
}

interface HealthResumeProps {
  severity: HealthSeverity
	className?: string
}

function HealthResume({ severity, className }: HealthResumeProps) {
  return (
    <Box
      sx={{
        height: 160,
        width: 160,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className={`HealthResume-${severity} ${className}`}
    >
      {severity && icons[severity]}
    </Box>
  );
}

const StyledHealthResume = styled(HealthResume)(({ theme }) => ({
	borderRadius: 4,

	'& svg': {
		width: 60, 
		height: 60,
	},

  "&.HealthResume-error": {
		color: theme.palette.error.dark,
    backgroundColor: alpha(theme.palette.error.main, 0.6),
  },

	"&.HealthResume-warning": {
		color: theme.palette.warning.dark,
    backgroundColor: alpha(theme.palette.warning.main, 0.6),

	},

	"&.HealthResume-good": {
    color: theme.palette.success.dark,
    backgroundColor: alpha(theme.palette.success.main, 0.6),
  },

}));

export default StyledHealthResume