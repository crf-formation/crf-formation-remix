import type { TabProps } from "@mui/material";
import { Link, Tab } from "@mui/material";
import { useMatch, useResolvedPath } from 'react-router';
interface Props extends TabProps {
  href: string;
  index: number;
}

export default function AppTabLink({ href, index, ...props }: Props) {
	const resolved = useResolvedPath(href);
  const matches = useMatch({ path: resolved.pathname, end: false });

  // TRICK: we calculate only here if the AppTab match, so we trick the tab value to be "current"
  return (
  // @ts-ignore selected exists
    <Tab
      component={Link}
      selected={matches}
      href={href}
      color="inherit"
      underline="none"
      {...props} // Tabs will clone this element and pass some props
    />
  );
}