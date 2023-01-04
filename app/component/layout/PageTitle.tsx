import { Typography } from "@mui/material";

interface Props {
	title: string;
}

export default function PageTitle({ title }: Props) {
	return (
		<Typography variant="h1" sx={{ mt: 0.5, mb: 2 }}>
			{title}
		</Typography>
	)
}