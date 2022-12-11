import { Box } from "@mui/material";
import type { ReactNode } from 'react';
import type { EditProps } from 'react-admin';
import { Edit } from 'react-admin';
import invariant from "tiny-invariant";
import Main from "~/components/layout/Main";

interface EditLayoutProps<DataDto> extends EditProps {
  children: ReactNode;
  /**
   * to have a reduced form width. Usefull for simple forms, avoiding input that takes the whole screen length.
   */
  small?: boolean;
  mapper: (data: any) => DataDto;
}

export default function EditLayout<DataDto>({ children, small, mapper, ...props }: EditLayoutProps<DataDto>) {
  invariant(mapper, `missing mapper`)

  return (
    <Main>
      <Box
        sx={{
          "& .RaEdit-main": {
            padding: [0, 2],
            maxWidth: small ? 860 : 1200,
            margin: 'auto',
          },
        }}
      >
        <Edit {...props} transform={mapper}>
          {children}
        </Edit>
      </Box>
    </Main>
  );
}