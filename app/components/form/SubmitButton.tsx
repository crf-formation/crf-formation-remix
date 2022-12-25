import { useIsSubmitting } from "remix-validated-form";
import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";

export default function SubmitButton({ children, ...props }: ButtonProps) {
  const isSubmitting = useIsSubmitting();

	// TODO: loading button
  return (
    <Button type="submit" variant="contained" color="primary">
      {isSubmitting ? "Chargement" : children}
    </Button>
  );
}
