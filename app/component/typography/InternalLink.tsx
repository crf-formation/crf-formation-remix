// @ts-ignore
import Link from "@mui/material/Link";
import { NavLink } from "@remix-run/react";
import type { LinkProps } from "@mui/material/Link/Link";
import type { ReactNode } from "react";

type Props = LinkProps & {
  href?: string;
  to?: string;
  children: ReactNode;
}

export default function InternalLink({ href, to, children, ...props }: Props) {
  return (
    <Link component={NavLink} {...props} to={to || href}>
      {children}
    </Link>
  );
}