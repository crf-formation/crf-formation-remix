import { SvgIcon } from "@mui/material";
import type { SvgIconProps } from "@mui/material";

export default function LogoHorizontal(props: SvgIconProps) {
  return (
    <SvgIcon
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="28.101 167.757 618.148 133.83"
      {...props}
    >
      <path
        fill="#d32f2f"
        d="M73.764 169.507v46.012H27.752v40.01h46.012v46.012h40.01v-46.012h46.012v-40.01h-46.012v-46.012h-40.01z"
      ></path>
      <text
        style={{
          whiteSpace: "pre",
          fontFamily: "Roboto",
          fontWeight: 500,
          fontSize: 66.5,
          fill: "#d32f2f",
        }}
        x="189.86"
        y="258.772"
      >
        CRF Formation
      </text>
    </SvgIcon>
  );
}
