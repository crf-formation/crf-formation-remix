import type { PlaceEntity } from "~/entity";
import type { PlaceApiObject } from "~/apiobject/place.apiobject";
import type { PlaceDto } from "~/dto/place.dto";

export function placeApiObjectToDto(apiObject: PlaceApiObject): PlaceDto {
  return {
    id: apiObject.id,
    createdAt: apiObject.createdAt,
    updatedAt: apiObject.updatedAt,
    title: apiObject.title
  };
}

export function placeEntityToApiObject(entity: PlaceEntity): PlaceApiObject {
  return {
    id: entity.id,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    title: entity.title
  };
}
