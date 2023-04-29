import { createElement } from "react";

import { ChevronRight, ExpandLess, ExpandMore } from "@mui/icons-material";

interface Props {
  open: boolean;
  variant?: "expand" | "default";
}

function ChevronToggle({ open, variant = "default", ...props }: Props) {
  const icon =
    variant === "default"
      ? !open
        ? ChevronRight
        : ExpandMore
      : !open
        ? ExpandMore
        : ExpandLess;

  return createElement(icon, { ...props });
}

export default ChevronToggle;
