import type { PseCompetenceApiObject } from "~/apiobject/psecompetence.apiobject";
import { pseCompetenceEntityToApiObject } from "~/mapper/psecompetence.mapper";
import { getPseCompetenceEntites } from "~/repository/psecompetence.repository";

export async function getPseCompetences(): Promise<Array<PseCompetenceApiObject>> {
	const list = await getPseCompetenceEntites()

	return list.map(pseCompetenceEntityToApiObject)
}
