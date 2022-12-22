import type { Prisma } from "@prisma/client";
import type { PseConcreteCaseSituationPostApiObject, PseConcreteCaseSituationPutApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import { prisma } from "~/db.server";
import type { PseConcreteCaseSituationEntity } from "~/entity";

const includeForSingleItem = {
  pseConcreteCaseType: true,
  pseConcreteCaseGroups: { include: { pseConcreteCaseGroup: true } },
  teacher: true,
  pseConcreteCaseSession: { select: { id: true } }
}

export async function createPseConcreteCaseSituationEntity(
	pseConcreteCaseSituationPostApiObject: PseConcreteCaseSituationPostApiObject
): Promise<PseConcreteCaseSituationEntity> {
	const { pseConcreteCaseGroups, ...data } = pseConcreteCaseSituationPostApiObject;

  return await prisma.$transaction<PseConcreteCaseSituationEntity>(async (tx) => {
    const entity = await tx.pseConcreteCaseSituation.create({
      data,
    });

    // TODO: group order

    return await findPseConcreteCaseSituationEntityOnTransaction(tx, entity.id)
  })
}

export async function updatePseConcreteCaseSituationEntity(
  id: string,
  pseConcreteCaseSituationPutApiObject: PseConcreteCaseSituationPutApiObject
): Promise<PseConcreteCaseSituationEntity> {
  const { pseConcreteCaseGroups, ...data } = pseConcreteCaseSituationPutApiObject;

  return await prisma.$transaction<PseConcreteCaseSituationEntity>(async (tx) => {
    const entity = await tx.pseConcreteCaseSituation.update({
      data,
      where: {
        id,
      },
    });

		// TODO: group order

    return await findPseConcreteCaseSituationEntityOnTransaction(tx, entity.id);
  });
}

async function findPseConcreteCaseSituationEntityOnTransaction(tx: Prisma.TransactionClient, id: string): Promise<PseConcreteCaseSituationEntity> {
  return await tx.pseConcreteCaseSituation.findUnique({
    where: { id },
    include: includeForSingleItem,
  }) as PseConcreteCaseSituationEntity;
}

export async function findPseConcreteCaseSituationEntity(id: string): Promise<Optional<PseConcreteCaseSituationEntity>> {
  return await prisma.pseConcreteCaseSituation.findUnique({
    where: { id },
    include: includeForSingleItem,
  });
}