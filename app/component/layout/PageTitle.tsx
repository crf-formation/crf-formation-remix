import { Typography } from "@mui/material";


export default function PageTitle({ title, centered }: { title: string, centered?: boolean }) {
  return (
    <Typography variant="h3" sx={{ textAlign: centered ? "center" : "left" }}>
      {title}
    </Typography>
  );
}