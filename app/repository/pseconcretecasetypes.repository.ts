import { prisma } from "~/db.server";
import type { PseConcreteCaseTypeEntity } from "~/entity";

export async function findPseConcreteCaseTypeEntityById(id: string): Promise<Optional<PseConcreteCaseTypeEntity>> {
	const pseConcreteCaseTypeEntity = await prisma.pseConcreteCaseType.findUnique({
    where: { id },
    include: {
			competencesToEvaluate: true, 
    },
  });
  if (!pseConcreteCaseTypeEntity) {
    return null;
  }
  return pseConcreteCaseTypeEntity;
}


export async function findPseConcreteCaseTypes(): Promise<Array<PseConcreteCaseTypeEntity>> {
	return await prisma.pseConcreteCaseType.findMany({
    where: {},
    include: {
			competencesToEvaluate: true, 
    },
  });
}