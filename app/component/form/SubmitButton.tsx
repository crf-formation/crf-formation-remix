import type { ButtonProps } from "@mui/material";
import Button from "@mui/material/Button";
import { useIsSubmitting } from "remix-validated-form";

export default function SubmitButton({ children, ...props }: ButtonProps) {
  const isSubmitting = useIsSubmitting();

  // TODO: loading button
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      aria-label="submit"
    >
      {isSubmitting ? "Chargement" : children}
    </Button>
  );
}
