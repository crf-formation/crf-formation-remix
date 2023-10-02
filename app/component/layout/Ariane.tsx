import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import type { ReactNode } from "react";
import React from "react";

export function ArianeBackItem({ href }: { href: string }) {
  return (
    <ArianeItem
      href={href}
      underline={false}
      label={
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ChevronLeftIcon /> Back
        </Box>
      }
    />
  );
}

interface ArianeItemProps {
  label: string | ReactNode;
  href?: Optional<string>;
  underline?: boolean;
}

export function ArianeItem({ label, href, underline = true }: ArianeItemProps) {
  return href ? (
    <Link
      href={href}
      underline={underline ? "hover" : undefined}
      sx={{
        // avoid having link color + underline
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {label}
    </Link>
  ) : (
    <span>{label}</span>
  );
}

interface Props {
  children: Array<ReactNode> | ReactNode;
}

export function Ariane({ children: childrenParam }: Props) {
  if (!childrenParam) {
    return null;
  }

  const children = (
    Array.isArray(childrenParam) ? childrenParam : [childrenParam]
  )
    .flat()
    // filter nil values and empty array (resulting of a map with no Ariane built)
    .filter(
      (child) => Boolean(child) && (!Array.isArray(child) || child.length > 0)
    );

  return (
    <Breadcrumbs
      maxItems={5}
      sx={{ display: "flex", pt: 2, pl: 4 }}
      separator="›"
    >
      {React.Children.map(children, (child: ReactNode, index: number) => (
        <Box
          sx={{ display: "flex" }}
          color={index === children.length - 1 ? "text.primary" : undefined}
        >
          {child}
        </Box>
      ))}
    </Breadcrumbs>
  );
}
