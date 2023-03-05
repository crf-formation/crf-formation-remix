import { Box } from "@mui/material"


export default function PseAcquiredLabel({ acquired, acquiredForPse1 }: { acquired: boolean, acquiredForPse1?: boolean }) {
	const sx = {
		fontWeight: 500,
	}
	
	if (acquired) {
		return <Box sx={{ ...sx, color: 'success.main' }}>OUI</Box>
	}

	if (acquiredForPse1) {
		return <Box sx={{ ...sx, color: 'warning.main' }}>PSE1</Box>
	}

	return <Box sx={{ ...sx, color: 'error.main' }}>NON</Box>
}