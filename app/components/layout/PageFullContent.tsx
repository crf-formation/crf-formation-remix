import type { SxProps } from '@mui/material';
import type { ReactNode } from 'react';
import Main from './Main';

interface Props {
	children: ReactNode,
  sx?: SxProps,
}

/**
 * For full height page, without the header.
 */
export default function PageFullContent({ sx, children }: Props) {
  return (
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
  );
}