import type { PseUserSummaryApiObject } from "~/apiobject/pseusesummary.apiobject";
import { loadAndBuildPseUserSummary } from "~/helper/pseusesummary.hepler";


export async function getPseUserSummary(formationId: string, userId: string): Promise<PseUserSummaryApiObject> {

	return loadAndBuildPseUserSummary(formationId, userId)
}