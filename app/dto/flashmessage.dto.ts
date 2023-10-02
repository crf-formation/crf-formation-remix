import type { AbstractDto } from "./abstract.dto";

export type FlashMessageSeverityDtoEnum =
  | "error"
  | "warning"
  | "info"
  | "success";

export interface FlashMessageDto extends AbstractDto {
  id: string;
  message: string;
  severity: FlashMessageSeverityDtoEnum;
}
