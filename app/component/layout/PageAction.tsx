import { Stack } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PageAction({ children }: Props) {
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 0.5, mb: 2, alignItems: "center" }}>
      {children}
    </Stack>
  );
}