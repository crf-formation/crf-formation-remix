import { Box } from "@mui/material";
import type { CreateProps } from "react-admin";
import { Create } from "react-admin";
import Main from "~/component/layout/Main";

interface CreateLayoutProps extends CreateProps {
  children: ReactElement;
  /**
   * to have a reduced form width. Usefull for simple forms, avoiding input that takes the whole screen length.
   */
  small?: boolean;
}

export default function CreateLayout({ children, small, mapper, ...props }: CreateLayoutProps) {
  return (
    <Main>
      <Box
        sx={{
          "& .RaCreate-main": {
            padding: [0, 2],
            maxWidth: small ? 860 : 1200,
            margin: "auto"
          }
        }}
      >
        <Create {...props}>
          {children}
        </Create>
      </Box>
    </Main>
  );
}
