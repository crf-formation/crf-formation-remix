export interface FlashMessage {
  readonly id: string;
  readonly message: string;
  readonly severity: FlashMessageType;
}

export type FlashMessageType = "error" | "warning" | "info" | "success";

