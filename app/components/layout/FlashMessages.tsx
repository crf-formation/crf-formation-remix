import { useState, forwardRef } from "react"
import type { AlertProps } from '@mui/material/Alert';
import { Snackbar, Alert as MuiAlert } from "@mui/material";
import type { FlashMessage } from '~/services/flash.server';
import useRootData from '~/hooks/useRootData';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

interface FlashMessageSnackbarProps {
  flashMessage: FlashMessage
}

function FlashMessageSnackbar({ flashMessage }: FlashMessageSnackbarProps) {
  const [open, setOpen] = useState(true)

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={(event, reason) => {
        if (reason === "timeout") {
          setOpen(false)
        } else if (reason === "clickaway") {
          // do nothing
        }
      }}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={(theme) => ({
        top: "calc(var(--header-height) + 8px)",
        [theme.breakpoints.up("md")]: {
          top: "calc(var(--header-height) + 8px)",
        },
      })}
    >
      <Alert 
        severity={flashMessage.severity}
        onClick={() => setOpen(false)}
      >
        {flashMessage.message}
      </Alert>
    </Snackbar>
  );
}

export default function FlashMessages() {
  const { flashMessages } = useRootData()

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