import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export default function TipTooltip({ tip }: { tip: string }) {
  return (
    <Tooltip title={tip}>
      <IconButton>
        <TipsAndUpdatesIcon />
      </IconButton>
    </Tooltip>
  );
}