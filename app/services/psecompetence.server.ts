import type { PseCompetenceApiObject } from "~/apiobject/psecompetence.apiobject";


export async function getPseCompetences(): Promise<Array<PseCompetenceApiObject>> {
	// TODO: load from database
	return [
		{
			id: "C1",
		},
		{
			id: "C2",
		},
		{
			id: "C3",
		},
		{
			id: "C4_1",
		},
		{
			id: "C4_2",
		},
		{
			id: "C4_3",
		},
		{
			id: "C5",
		},
		{
			id: "C6",
		},
	]
}