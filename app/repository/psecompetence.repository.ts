import type { PseCompetenceEntity } from "~/apiobject/entity";

export async function getPseCompetenceEntites(): Promise<Array<PseCompetenceEntity>> {
	return await prisma.pseTechnique.findMany({
    where: {},
    include: {
    },
  });
}