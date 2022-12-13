import { Link, Tab } from "@mui/material";
import type { TabProps } from "@mui/material";

interface Props extends TabProps {
  href: string;
}

export default function AppTabLink({ href, ...props }: Props) {

	return (
    <Link href={href} color="inherit" underline="none">
      <Tab {...props} />
    </Link>
  );
}