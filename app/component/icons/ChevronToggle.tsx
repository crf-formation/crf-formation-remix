import { createElement } from "react";

import ChevronRight from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

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
