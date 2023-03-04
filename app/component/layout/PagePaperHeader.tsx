import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function PagePaperHeader({ children }: Props) {

	return (
		<Box
			sx={{
				px: 14,
				pt: 6,
				pb: 6,
				backgroundColor: '#FBF7FF',
			}}
		>
			{children}
		</Box>
	)
}