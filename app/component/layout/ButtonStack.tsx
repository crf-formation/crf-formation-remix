import type { StackProps } from "@mui/material";
import { Stack } from "@mui/material";
import React from "react";

/**
 * Specific Stack for buttons. Buttons must have a div on a Stack, otherwise they
 * display on the whole Stack width.
 */
export default function ButtonStack({ children, ...props }: StackProps) {
  return (
    <Stack spacing={1} {...props}>
      {React.Children.map(children, child => <div>{React.cloneElement(child)}</div>)}
    </Stack>
  );
}