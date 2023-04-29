import { Typography } from "@mui/material";

interface Props {
  checked: boolean;
  withColor?: Optional<boolean>;
  trueText?: string;
  trueColor?: string;
  falseText?: string;
}

export function BooleanText({ checked, withColor, trueText, trueColor, falseText }: Props) {
  if (checked) {
    return (
      <Typography sx={{ color: withColor ? trueColor || "success.main" : "inherit" }}>
        {trueText || "Oui"}
      </Typography>
    );
  }
  return (
    <Typography sx={{ color: withColor ? "error.main" : "inherit" }}>
      {falseText || "Non"}
    </Typography>
  );
}