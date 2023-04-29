import { Box } from "@mui/material";

type Variant = "header"

interface Props {
  variant: Variant;
}

export default function PageSpace({ variant }: Props) {
  const mbs: { [key in Variant]: number } = {
    header: 8
  };

  return (
    <Box mb={mbs[variant]} />
  );
}