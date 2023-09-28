import type { SxProps } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import type { ReactNode } from "react";
import Main from "./Main";

interface Props {
  children: ReactNode,
  sx?: SxProps,
}

/**
 * For full height page, without the header.
 */
export default function PageFullContent({ sx, children }: Props) {
  return (
    <>
      {/* override global style: */}
      <GlobalStyles
        styles={{
          ":root": {
            // modify spinner position for all the full content pages.
            "--nprogress-spinner-left": "24px",
          },
        }}
      />
      <Main
        sx={{
          flexDirection: "row",
          height: `100vh`,
          backgroundColor: "#051e34",
          ...sx
        }}
      >
        {children}
      </Main>

    </>
  );
}