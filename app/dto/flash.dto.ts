export interface FlashMessage {
  id: string;
  message: string;
  severity: FlashMessageType;
}

export type FlashMessageType = "error" | "warning" | "info" | "success";

