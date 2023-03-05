import type { PaginateObject } from "~/constant/types";
import { InternalServerException } from "~/service/api.error";

export function paginateEntityToApiObject<Entity, ApiObject>(paginatedData: PaginateObject<Entity>, mapper: (entity: Entity) => ApiObject): PaginateObject<ApiObject> {
	return {
    ...paginatedData,
    data: paginatedData.data.map(mapper),
  };
}

export function paginateApiObjectToDto<ApiObject, Dto>(paginatedData: PaginateObject<ApiObject>, mapper: (apiObject: ApiObject) => Dto): PaginateObject<Dto> {
	return {
    ...paginatedData,
    data: paginatedData.data.map(mapper),
  };
}



export function assertEnum<T>(value: string, arrayOfEnumValues: Array<T>): T {
	if (!arrayOfEnumValues.includes(value as T)) {
		throw new InternalServerException(`Enum value "${value}" does not exists on ${arrayOfEnumValues.join(', ')}`);
	}

	return value as T
}