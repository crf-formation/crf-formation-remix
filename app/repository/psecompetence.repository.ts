import { prisma } from "~/db.server";
import type { PseCompetenceEntity } from "~/entity";

export async function getPseCompetenceEntites(): Promise<Array<PseCompetenceEntity>> {
	return await prisma.pseTechnique.findMany({
    where: {},
    include: {
    },
  });
}