import { prisma } from "~/entity/db.server";
import type { PseConcreteCaseTypeEntity } from "~/entity";

const include = {
  competencesToEvaluate: { include: { pseCompetence: true } }, 
}

export async function findPseConcreteCaseTypeEntityById(id: string): Promise<Optional<PseConcreteCaseTypeEntity>> {
	const pseConcreteCaseTypeEntity = await prisma.pseConcreteCaseType.findUnique({
    where: { id },
    include,
  });
  if (!pseConcreteCaseTypeEntity) {
    return null;
  }
  return pseConcreteCaseTypeEntity;
}


export async function findPseConcreteCaseTypes(): Promise<Array<PseConcreteCaseTypeEntity>> {
	return await prisma.pseConcreteCaseType.findMany({
    where: {},
    include,
  });
}