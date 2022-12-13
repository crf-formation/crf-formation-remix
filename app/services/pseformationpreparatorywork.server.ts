import type { PseUserPreparatoryWorkApiObject } from "~/apiobject/pseformationpreparatorywork.apiobject";
import { getPseModuleByModuleId } from "./psemodule.server";

const pseModulesToPrepare = [
	'M1',
	'M2',
	'M3',
	'M5',
	'M6',
	// TODO: uncomment once create on seed
	// 'MCAT',
	// 'M15',
	// 'M17',
	// 'M18',
]

export async function getPreparatoryWorksForUser(formationId: string, userId: string): Promise<Array<PseUserPreparatoryWorkApiObject>> {
	return Promise.all(pseModulesToPrepare.map(async pseModuleId => await createPseUserPreparatoryWorkApiObject(formationId, userId, pseModuleId)))
}

async function createPseUserPreparatoryWorkApiObject(formationId: string, userId: string, pseModuleId: string): Promise<PseUserPreparatoryWorkApiObject> {
	const pseModuleApiObject = await getPseModuleByModuleId(pseModuleId);

	return {
		id: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		userId,
		formationId,
		pseModule: pseModuleApiObject,
		pseModuleId,
		openingDate: null,
		realisedDate: null,
		realised: false,
	}

}
