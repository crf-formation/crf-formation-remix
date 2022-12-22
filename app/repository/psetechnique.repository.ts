import { prisma } from "~/db.server";
import type { PseTechniqueEntity } from "~/entity";

const includeForSingleItem = {
  pseModule: true
}

export async function findPseTechniqueEntityById(id: string): Promise<Optional<PseTechniqueEntity>> {
	const pseTechniqueEntity = await prisma.pseTechnique.findUnique({
    where: { id },
    include: includeForSingleItem,
  });
  if (!pseTechniqueEntity) {
    return null;
  }
  return pseTechniqueEntity;
}


export async function findPseTechniques(): Promise<Array<PseTechniqueEntity>> {
	return await prisma.pseTechnique.findMany({
    where: {},
    include: includeForSingleItem,
  });
}