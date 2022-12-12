import type { PlaceApiObject } from "~/apiobject/place.apiobject";
import type { PlaceDto } from "~/dto/place.dto";

export function placeApiObjectToPlaceDto(apiObject: PlaceApiObject): PlaceDto {
  return {
    id: apiObject.id,
    createdAt: apiObject.createdAt,
    updatedAt: apiObject.updatedAt,
    title: apiObject.title,
  };
}