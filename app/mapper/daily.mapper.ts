import type { DailyNoteApiObject, DailyNotePostApiObject } from "~/apiobject/daily.apiobject";
import type { DailyNoteDto, DailyNotePostDto } from "~/dto/daily.dto";

export function dailyNoteApiObjectToDto(apiObject: DailyNoteApiObject): DailyNoteDto {
  return {
    id: apiObject.id,
    title: apiObject.title,
    content: apiObject.content,
    createAt: apiObject.createAt,
    updatedAt: apiObject.updatedAt
  };
}

export function dailyNotePostApiObjectToDto(apiObject: DailyNotePostApiObject): DailyNotePostDto {
  return {
    title: apiObject.title,
    content: apiObject.content
  };
}

export function dailyNotePostDtoToApiObject(dto: DailyNotePostDto): DailyNotePostApiObject {
  return {
    title: dto.title,
    content: dto.content
  };
}
