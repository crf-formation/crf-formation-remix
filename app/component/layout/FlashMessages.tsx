import { Alert as MuiAlert, Snackbar } from "@mui/material";
import type { AlertProps } from "@mui/material/Alert";
import { forwardRef, useState } from "react";
import type { FlashMessage } from "~/dto/flash.dto";
import useRootData from "~/hook/useRootData";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

interface FlashMessageSnackbarProps {
  flashMessage: FlashMessage;
}

function FlashMessageSnackbar({ flashMessage }: FlashMessageSnackbarProps) {
  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={(event, reason) => {
        if (reason === "timeout") {
          setOpen(false);
        } else if (reason === "clickaway") {
          // do nothing
        }
      }}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={(theme) => ({
        top: "calc(var(--header-height) + 8px)",
        [theme.breakpoints.up("md")]: {
          top: "calc(var(--header-height) + 8px)"
        }
      })}
    >
      <Alert
        severity={flashMessage.severity || "info"}
        color={"info"} // TODO: remove, use only severity
        onClick={() => setOpen(false)}
      >
        {flashMessage.message}
      </Alert>
    </Snackbar>
  );
}

export default function FlashMessages() {
  const { flashMessages } = useRootData();

  if (!flashMessages || flashMessages.length === 0) {
    return null;
  }

  return (
    <>
      {flashMessages.map((flashMessage: FlashMessage) => (
        <FlashMessageSnackbar
          key={flashMessage.id}
          flashMessage={flashMessage}
        />
      ))}
    </>
  );
}