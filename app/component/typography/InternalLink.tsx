// @ts-ignore
import { Link } from "@mui/material";
import { NavLink } from "@remix-run/react";


export default function InternalLink({ href, to, children, ...props }) {
	return (
    <Link component={NavLink} {...props} to={to || href}>
      {children}
    </Link>
  );
}