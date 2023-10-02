export type FlashMessageSeverityApiEnum =
  | "error"
  | "warning"
  | "info"
  | "success";

export interface FlashMessageApiObject {
  id: string;
  message: string;
  severity: FlashMessageSeverityApiEnum;
}
