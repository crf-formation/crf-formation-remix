import type { PaginateObject } from "~/constants/types";

export function paginateEntityToApiObject<Entity, ApiObject>(paginatedData: PaginateObject<Entity>, mapper: (entity: Entity) => ApiObject): PaginateObject<ApiObject> {
	const apiObjectPaginatedData: PaginateObject<ApiObject> = {
    ...paginatedData,
    data: paginatedData.data.map(mapper),
  };

	return apiObjectPaginatedData; 
}