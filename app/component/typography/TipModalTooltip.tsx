import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle;
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import amber from "@mui/material/colors/amber";
import type { MouseEventHandler, ReactNode } from "react";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  title?: string;
  tip: ReactNode;
  withClose?: boolean;
  onClose?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function TipModalTooltip({ title, tip, onClose, withClose = false }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen((open) => !open)}>
        <TipsAndUpdatesIcon />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TipsAndUpdatesIcon sx={{ color: amber[600] }} fontSize="large" />
              <Box ml={2}><Typography component="div">{title || "Tip"}</Typography></Box>
            </Box>
            {(withClose || onClose) ? (
              <IconButton
                aria-label="close"
                onClick={(e) => {
                  setOpen(false);
                  onClose && onClose(e);
                }}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <CloseIcon />
              </IconButton>
            ) : null}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ minWidth: 360, p: 4, mt: 2 }}>
          <Typography component="div">{tip}</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}