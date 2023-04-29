import { Box } from "@mui/material";
import type { ReactNode } from "react";
import type { EditProps } from "react-admin";
import { Edit } from "react-admin";
import Main from "~/component/layout/Main";

interface EditLayoutProps extends EditProps {
  children: ReactNode;
  /**
   * to have a reduced form width. Usefull for simple forms, avoiding input that takes the whole screen length.
   */
  small?: boolean;
}

export default function EditLayout({ children, small, ...props }: EditLayoutProps) {
  return (
    <Main>
      <Box
        sx={{
          "& .RaEdit-main": {
            padding: [0, 2],
            maxWidth: small ? 860 : 1200,
            margin: "auto"
          }
        }}
      >
        <Edit {...props}>
          {children}
        </Edit>
      </Box>
    </Main>
  );
}
