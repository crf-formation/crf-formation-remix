import type { PseModuleApiObject } from "./psemodule.apiobject";

export interface PseTechniqueApiObject {
	id: string;
	name: string;
	requiredForPse1: boolean;
	// TODO: rename to module?
	pseModule: PseModuleApiObject;
	pseModuleId: string;
}