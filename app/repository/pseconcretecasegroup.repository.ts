import { prisma } from "~/db.server";
import type { PseConcreteCaseGroupPostApiObject, PseConcreteCaseGroupPutApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import type { PseConcreteCaseGroupEntity } from "~/entity";
import type { Prisma } from "@prisma/client";


export async function createPseConcreteCaseGroupEntity(
	pseConcreteCaseGroupPostApiObject: PseConcreteCaseGroupPostApiObject
): Promise<PseConcreteCaseGroupEntity> {
	const { students, ...data } = pseConcreteCaseGroupPostApiObject;

  return await prisma.$transaction<PseConcreteCaseGroupEntity>(async (tx) => {
    const entity = await tx.pseConcreteCaseGroup.create({
      data,
    });

    await Promise.all(
      students.map(async (userId) => {
        return tx.pseUserConcreteCaseGroupStudent.create({
          data: {
            userId,
            pseConcreteCaseGroupId: entity.id,
          },
        });
      })
    );

    return await findPseConcreteCaseGroupEntityOnTransaction(tx, entity.id)
  })
}

export async function updatePseConcreteCaseGroupEntity(
  id: string,
  pseConcreteCaseGroupPutApiObject: PseConcreteCaseGroupPutApiObject
): Promise<PseConcreteCaseGroupEntity> {
  const { students, ...data } = pseConcreteCaseGroupPutApiObject;

  return await prisma.$transaction<PseConcreteCaseGroupEntity>(async (tx) => {
    const entity = await tx.pseConcreteCaseGroup.update({
      data,
      where: {
        id,
      },
    });

    // TODO: update or create
    await tx.pseUserConcreteCaseGroupStudent.deleteMany({
      where: {
        pseConcreteCaseGroupId: id,
      },
    });
    await Promise.all(
      students.map(async (userId) => {
        return tx.pseUserConcreteCaseGroupStudent.create({
          data: {
            userId,
            pseConcreteCaseGroupId: entity.id,
          },
        });
      })
    );

    return await findPseConcreteCaseGroupEntityOnTransaction(tx, entity.id);
  });
}

async function findPseConcreteCaseGroupEntityOnTransaction(tx: Prisma.TransactionClient, id: string): Promise<PseConcreteCaseGroupEntity> {
  return await tx.pseConcreteCaseGroup.findUnique({
    where: { id },
    include: {
      students: { include: { user: true } },
      pseConcreteCaseSession: { select: { id: true } }
    },
  }) as PseConcreteCaseGroupEntity;
}

export async function findPseConcreteCaseGroupEntity(id: string): Promise<Optional<PseConcreteCaseGroupEntity>> {
  return await prisma.pseConcreteCaseGroup.findUnique({
    where: { id },
    include: {
      students: { include: { user: true } },
      pseConcreteCaseSession: { select: { id: true } }
    },
  });
}