import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PageActions({ children }: Props) {
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 0.5, mb: 2, alignItems: "center" }}>
      {children}
    </Stack>
  );
}