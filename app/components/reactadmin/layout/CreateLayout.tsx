import { Box } from "@mui/material";
import type { CreateProps } from "react-admin";
import { Create } from "react-admin";
import invariant from "tiny-invariant";
import Main from "~/components/layout/Main";

interface CreateLayoutProps<DataDto> extends CreateProps {
  children: ReactElement;
  /**
   * to have a reduced form width. Usefull for simple forms, avoiding input that takes the whole screen length.
   */
  small?: boolean;
  mapper: (data: any) => DataDto;
}

export default function CreateLayout<DataDto>({ children, small, mapper, ...props }: CreateLayoutProps<DataDto>) {
  invariant(mapper, `missing mapper`)

  return (
    <Main>
      <Box
        sx={{
          "& .RaCreate-main": {
            padding: [0, 2],
            maxWidth: small ? 860 : 1200,
            margin: "auto",
          },
        }}
      >
        <Create {...props}>
          {children}
        </Create>
      </Box>
    </Main>
  );
}
