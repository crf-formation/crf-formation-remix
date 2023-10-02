import type {
  FlashMessageApiObject,
  FlashMessageSeverityApiEnum,
} from "~/apiobject/flashmessage.apiobject";
import type {
  FlashMessageDto,
  FlashMessageSeverityDtoEnum,
} from "~/dto/flashmessage.dto";
import { assertEnum } from "./abstract.mapper";

export function flashMessageApiObjectToDto(
  flashMessageApiObject: FlashMessageApiObject
): FlashMessageDto {
  return {
    id: flashMessageApiObject.id,
    message: flashMessageApiObject.message,
    severity: flashMessageSeverityApiEnumToDto(flashMessageApiObject.severity),
  };
}

function flashMessageSeverityApiEnumToDto(
  severity: FlashMessageSeverityApiEnum
): FlashMessageSeverityDtoEnum {
  return assertEnum<FlashMessageSeverityDtoEnum>(severity, [
    "error",
    "warning",
    "info",
    "success",
  ]);
}
