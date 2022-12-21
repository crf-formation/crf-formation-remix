import { prisma } from "~/db.server";
import type { PseConcreteCaseGroupPostApiObject, PseConcreteCaseGroupPutApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import type { PseConcreteCaseGroupEntity } from "~/entity";


export async function createPseConcreteCaseGroupEntity(
	pseConcreteCaseGroupPostApiObject: PseConcreteCaseGroupPostApiObject
): Promise<PseConcreteCaseGroupEntity> {
	const { students, ...data } = pseConcreteCaseGroupPostApiObject;

	// TODO: in transactions
  const entity = await prisma.pseConcreteCaseGroup.create({
    data
  }); 

	await Promise.all(students.map(async (userId) => {
		return prisma.pseUserConcreteCaseGroupStudent.create({
      data: {
        userId,
        pseConcreteCaseGroupId: entity.id,
      },
    }); 
	}));

	return await findPseConcreteCaseGroupEntity(entity.id) as PseConcreteCaseGroupEntity;
}

export async function updatePseConcreteCaseGroupEntity(
  id: string,
  pseConcreteCaseGroupPutApiObject: PseConcreteCaseGroupPutApiObject
): Promise<PseConcreteCaseGroupEntity> {
  const { students, ...data } = pseConcreteCaseGroupPutApiObject;

  // TODO: in transactions

  const entity = await prisma.pseConcreteCaseGroup.update({
    data,
    where: {
      id
    }
  });

  // TODO: update or create
  await prisma.pseUserConcreteCaseGroupStudent.deleteMany({
    where: {
      pseConcreteCaseGroupId: id,
    },
  });
  await Promise.all(
    students.map(async (userId) => {
      return prisma.pseUserConcreteCaseGroupStudent.create({
        data: {
          userId,
          pseConcreteCaseGroupId: entity.id,
        },
      });
    })
  );

  return (await findPseConcreteCaseGroupEntity(
    entity.id
  )) as PseConcreteCaseGroupEntity;
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