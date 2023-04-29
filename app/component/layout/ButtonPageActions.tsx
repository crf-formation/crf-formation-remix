import type { ReactNode } from "react";
import ButtonStack from "./ButtonStack";

interface Props {
  children: ReactNode;
}

export default function ButtonPageActions({ children }: Props) {
  return (
    <ButtonStack
      direction="row"
      sx={{ py: 2, px: 4, width: "100%", justifyContent: "flex-end" }}
    >
      {children}
    </ButtonStack>
  );
}