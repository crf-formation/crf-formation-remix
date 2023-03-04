import { Typography } from "@mui/material";


export default function PageSubtitle({ subtitle, centered }: { subtitle: string, centered?: boolean }) {
  return (
    <Typography
      variant="h5"
      sx={{ textAlign: centered ? "center" : "left", mt: 2, maxWidth: 680 }}
    >
      {subtitle}
    </Typography>
  );
}