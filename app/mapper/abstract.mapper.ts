import type { PaginateObject } from "~/constant/types";

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