import type { SvgIconProps } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";

export default function LogoHorizontal(props: SvgIconProps) {
  return (
    <SvgIcon
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="100 134.062 500 229.45"
      {...props}
    >
      <path
        fill="#C00"
        d="M330.083 134.062v46.012h-46.012v40.01h46.012v46.012h40.01v-46.012h46.012v-40.01h-46.012v-46.012h-40.01z"
      ></path>
      <text
        style={{ whiteSpace: "pre" }}
        x="119.109"
        y="349.036"
        fill="#333"
        fontFamily="Arial, sans-serif"
        fontSize="66.5"
      >
        CRF Formation
      </text>
    </SvgIcon>
  );
}
