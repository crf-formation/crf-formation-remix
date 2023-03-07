// @ts-ignore
import { Link } from "@mui/material";
import { NavLink } from "@remix-run/react";


export default function InternalLink({ children, ...props }) {
	return (
    <Link component={NavLink} {...props}>
      {children}
    </Link>
  );
}