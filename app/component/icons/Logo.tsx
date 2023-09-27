import type { SvgIconProps } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";

export default function LogoHorizontal(props: SvgIconProps) {
  return (
    <SvgIcon
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      width="660"
      height="660"
      viewBox="0 0 660 660"
      {...props}
    >
      <path
        fill="#c00"
        d="M230 0v230H0v200h230v230h200V430h230V230H430V0H230z"
      ></path>
    </SvgIcon>
  );
}
