import type { PseUserPreparatoryWorkApiObject, PseUserPreparatoryWorkPostApiObject } from "~/apiobject/pseuserpreparatorywork.apiobject";
import { pseUserPreparatoryWorkEntityToApiObject } from "~/mapper/pseformationpreparatorywork.mapper";
import { getPseUserPreparatoryWorkEntities, updatePseUserPreparatoryWorkEntities } from "~/repository/pseformationpreparatorywork.repository";
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
	const pseUserPreparatoryWorkEntities = await getPseUserPreparatoryWorkEntities(formationId, userId);
	// not in database yet, create default data
	if (pseUserPreparatoryWorkEntities.length === 0) {
		return Promise.all(pseModulesToPrepare.map(async pseModuleId => await buildPseUserPreparatoryWorkApiObject(formationId, userId, pseModuleId)))
	}
	return pseUserPreparatoryWorkEntities.map(pseUserPreparatoryWorkEntityToApiObject)
}

async function buildPseUserPreparatoryWorkApiObject(formationId: string, userId: string, pseModuleId: string): Promise<PseUserPreparatoryWorkApiObject> {
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

export async function updatePseUserPreparatoryWorks(formationId: string, userId: string, apiObjects: Array<PseUserPreparatoryWorkPostApiObject>) {
	await updatePseUserPreparatoryWorkEntities(formationId, userId, apiObjects)
}