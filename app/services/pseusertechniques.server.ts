import type { PseTechniqueApiObject } from "~/apiobject/psetechnique.apiobject";
import type { PseUserTechniqueApiObject } from "~/apiobject/pseusertechnique.apiobject";
import { findPseTechniques } from "~/repository/psetechnique.repository";


export async function getPseUserTechniquesForUser(formationId: string, userId: string): Promise<Array<PseUserTechniqueApiObject>> {
	const pseTechniqueApiObjects = await findPseTechniques();

	return Promise.all(pseTechniqueApiObjects.map(async pseTechniqueApiObject => await createPseUserTechniqueApiObject(formationId, userId, pseTechniqueApiObject)))
}

async function createPseUserTechniqueApiObject(formationId: string, userId: string, pseTechniqueApiObject: PseTechniqueApiObject): Promise<PseUserTechniqueApiObject> {
	return {
		id: null,
		userId,
		formationId,
		technique: pseTechniqueApiObject,
		techniqueId: pseTechniqueApiObject.id
	}
}