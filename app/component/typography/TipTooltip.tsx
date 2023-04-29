import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { IconButton, Tooltip } from "@mui/material";

export default function TipTooltip({ tip }: { tip: string }) {
  return (
    <Tooltip title={tip}>
      <IconButton>
        <TipsAndUpdatesIcon />
      </IconButton>
    </Tooltip>
  );
}