import { Box, Stack } from "@mui/material";
import { Form } from "@remix-run/react";
import type { ReactNode } from "react";

interface FormViewProps {
	children: ReactNode;
	action: ReactNode;
}

export default function FormView({
	children,
	action
}: FormViewProps) {
	return (
    <Form method="post">
      <Stack
        spacing={2}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        {children}
      </Stack>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>{action}</Box>
    </Form>
  );
}