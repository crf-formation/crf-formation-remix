import type { PseModuleApiObject } from "~/apiobject/psemodule.apiobject";
import { pseModuleEntityToApiObject } from "~/mapper/psemodule.mapper";
import { getPseModuleEntityByModuleId } from "~/repository/psemodule.repository";
import { NotFoundException } from "./api.error";

export async function getPseModuleByModuleId(moduleId: string): Promise<PseModuleApiObject> {
	const entity = await getPseModuleEntityByModuleId(moduleId);
	if (!entity) {
		throw new NotFoundException('PseModuleEntity', moduleId)
	}
	return pseModuleEntityToApiObject(entity)
}