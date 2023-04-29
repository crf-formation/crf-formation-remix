import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import { StatusCode, usePasswordCheck } from "~/hook/hibp/usePasswordCheck";
import type { Severity } from "../typography/Callout";
import Callout from "../typography/Callout";

interface PasswordCheckViewProps {
  password: string;
}

function getSeverity(statusCode: StatusCode | null): Severity {
  switch (statusCode) {
    case StatusCode.WAITING:
      return "info";
    case StatusCode.MIN_LENGTH:
      return "info";
    case StatusCode.CHECK_FAILED:
      return "warning";
    case StatusCode.NOT_PWNED:
      return "info";
    case StatusCode.PWNED:
      return "error";
    default:
      return "info";
  }
}

export default function PasswordCheckView(
  {
    password
  }: PasswordCheckViewProps) {
  const [statusCode, checkPassword] = usePasswordCheck();
  useEffect(() => checkPassword(password), [password, checkPassword]);

  if (!password || password.length === 0) {
    return null;
  }

  const severity = getSeverity(statusCode as StatusCode);
  return (
    <Box>
      <Callout severity={severity} withIcon={statusCode !== StatusCode.WAITING} sx={{ p: 1 }}>
        {statusCode === StatusCode.MIN_LENGTH && (
          <Typography>Password is too short</Typography>
        )}

        {statusCode === StatusCode.WAITING && (
          <Box sx={{ display: "flex", justifyContent: "row", alignItems: "center" }}>
            <CircularProgress size={16} />

            <Typography sx={{ ml: 1 }}>Checking password security</Typography>
          </Box>
        )}

        {statusCode === StatusCode.CHECK_FAILED && (
          <Typography>
            We were unable to verify your password security
          </Typography>
        )}

        {statusCode === StatusCode.NOT_PWNED && (
          <Typography>Your password is secured</Typography>
        )}

        {statusCode === StatusCode.PWNED && (
          <Typography>
            Your password is not secure
          </Typography>
        )}
      </Callout>
    </Box>
  );
}