import type { PseUserSummaryApiObject } from "~/apiobject/pseusersummary.apiobject";
import { loadAndBuildPseUserSummary } from "~/helper/pseusersummary.hepler";


export async function getPseUserSummary(formationId: string, userId: string): Promise<PseUserSummaryApiObject> {
	return loadAndBuildPseUserSummary(formationId, userId)
}