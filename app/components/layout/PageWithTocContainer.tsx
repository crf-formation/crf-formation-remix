import { Container } from '@mui/material';
import type { ReactNode } from 'react';
import type { TocLevel } from '~/services/markdown.server';
import { TableOfContent } from '../notion/TableOfContent';
import Main from './Main';

interface Props {
  showToc: boolean,
	tableOfContent: TocLevel[]
	tocMaxDepth: number
	children: ReactNode
}

export default function PageWithTocContainer({
  showToc = false,
	tableOfContent,
	tocMaxDepth,
	children,
}: Props) {
return (
  <Main
    sx={{
      flexDirection: "row",
      // required for sticky (ex: TableOfContent)
      // https://www.designcise.com/web/tutorial/how-to-fix-issues-with-css-position-sticky-not-working
      height: `calc(100vh - var(--header-height))`,
    }}
  >
    {showToc && (
      <TableOfContent
        tableOfContent={tableOfContent}
        tocMaxDepth={tocMaxDepth}
      />
    )}

    <Container
      sx={{
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        display: "block",
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 4,
        maxWidth: "105ch",
        position: "relative",
      }}
    >
      {children}
    </Container>
  </Main>
);
}