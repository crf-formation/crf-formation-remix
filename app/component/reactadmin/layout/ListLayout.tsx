import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import type { ReactElement, ReactNode } from "react";
import { ListBase, ListToolbar, Pagination, Title } from "react-admin";
import Main from "~/component/layout/Main";

interface MyListProps {
  children: ReactNode,
  actions?: ReactElement | false;
  filters?: ReactElement | ReactElement[];
  aside?: ReactElement;
  title: string;
}

function MyList({ children, actions, filters, aside, title, ...props }: MyListProps) {
  return (
    <ListBase {...props}>
      <Title title={title} />
      <ListToolbar filters={filters} actions={actions} />

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ ml: 2, order: -1 }}>{aside}</Box>

        <Box sx={{ maxWidth: 1200, flex: 1 }}>
          <Card
            sx={{
              // padding: [2, 2],
              paddingTop: 6 // add space for top bar that appears when we select an item
            }}
          >
            {children}
            <Pagination />
          </Card>
        </Box>
      </Box>
    </ListBase>
  );
}

interface ListLayoutProps {
  title: string;
  children: ReactNode,
  actions?: ReactElement | false;
  filters?: ReactElement | ReactElement[];
  aside?: ReactElement;
}

export default function ListLayout(
  {
    children,
    ...props
  }: ListLayoutProps) {
  return (
    <Main>
      <MyList
        {...props}
      >
        {children}
      </MyList>
    </Main>
  );
}
