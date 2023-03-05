import type { Prisma } from "@prisma/client";
import type { PseConcreteCaseSituationPostApiObject, PseConcreteCaseSituationPutApiObject, PseSituationConcreteCaseGroupPutApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import type { PseConcreteCaseSituationEntity } from "~/entity";
import { prisma } from "~/entity/db.server";

const includeForSingleItem = {
  pseConcreteCaseType: { include: { competencesToEvaluate: { include: { pseCompetence: true }} } },
  pseSituationConcreteCaseGroups: { include: { pseConcreteCaseGroup: true } },
  teacher: true,
  pseConcreteCaseSession: { select: { id: true } }
}

export async function createPseConcreteCaseSituationEntity(
	pseConcreteCaseSituationPostApiObject: PseConcreteCaseSituationPostApiObject
): Promise<PseConcreteCaseSituationEntity> {
	const { pseSituationConcreteCaseGroups, ...data } = pseConcreteCaseSituationPostApiObject;

  return await prisma.$transaction<PseConcreteCaseSituationEntity>(async (tx) => {
    const entity = await tx.pseConcreteCaseSituation.create({
      data,
    });

    // TODO: pseSituationConcreteCaseGroups

    return await findPseConcreteCaseSituationEntityOnTransaction(tx, entity.id)
  })
}

export async function updatePseConcreteCaseSituationEntity(
  id: string,
  pseConcreteCaseSituationPutApiObject: PseConcreteCaseSituationPutApiObject
): Promise<PseConcreteCaseSituationEntity> {
  const { pseSituationConcreteCaseGroups, ...data } = pseConcreteCaseSituationPutApiObject;

  return await prisma.$transaction<PseConcreteCaseSituationEntity>(async (tx) => {
    const entity = await tx.pseConcreteCaseSituation.update({
      data,
      where: {
        id,
      },
    });

    // TODO: update or create
    await tx.pseSituationConcreteCaseGroup.deleteMany({
      where: {
        pseConcreteCaseSituationId: id,
      },
    });
    await Promise.all(
      pseSituationConcreteCaseGroups.map(async (pseSituationConcreteCaseGroup: PseSituationConcreteCaseGroupPutApiObject) => {
        return tx.pseSituationConcreteCaseGroup.create({
          data: {
            ...pseSituationConcreteCaseGroup,
            pseConcreteCaseSituationId: entity.id,
          },
        });
      })
    );

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

export async function getPseConcreteCaseSituationEntitiesForPseConcreteCaseSessionId(pseConcreteCaseSessionId: string): Promise<Array<PseConcreteCaseSituationEntity>> {
  return await prisma.pseConcreteCaseSituation.findMany({
    where: {
      pseConcreteCaseSession: {
        id: pseConcreteCaseSessionId,
      },
    },
    include: includeForSingleItem, // TODO: list ?
  });
}