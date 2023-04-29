import type { PseUserPreparatoryWorkPostApiObject } from "~/apiobject/pseuserpreparatorywork.apiobject";
import type { PseUserPreparatoryWorkEntity } from "~/entity";
import { prisma } from "~/entity/db.server";

const includeForUser = {
  pseModule: true
};

export async function getPseUserPreparatoryWorkEntities(formationId: string, userId: string): Promise<PseUserPreparatoryWorkEntity[]> {
  return await prisma.pseUserPreparatoryWork.findMany({
    where: {
      userId,
      formationId
    },
    include: includeForUser
  });
}

export async function updatePseUserPreparatoryWorkEntities(formationId: string, userId: string, apiObjects: Array<PseUserPreparatoryWorkPostApiObject>) {

  return await prisma.$transaction<PseUserPreparatoryWorkEntity>(async (tx) => {
    return Promise.all(
      apiObjects.map(async (pseUserPreparatoryWorkPostApiObject) => {
        const pseUserPreparatoryWorkEntityData = {
          formationId,
          userId,
          openingDate: pseUserPreparatoryWorkPostApiObject.openingDate || null,
          realisedDate: pseUserPreparatoryWorkPostApiObject.realisedDate || null,
          realised: pseUserPreparatoryWorkPostApiObject.realised,
          pseModuleId: pseUserPreparatoryWorkPostApiObject.pseModuleId
        };

        const updatedPseUserPreparatoryWorkEntity =
          await tx.pseUserPreparatoryWork.upsert({
            where: {
              userId_formationId_pseModuleId: {
                userId,
                formationId,
                pseModuleId: pseUserPreparatoryWorkPostApiObject.pseModuleId
              }
            },
            update: pseUserPreparatoryWorkEntityData,
            create: pseUserPreparatoryWorkEntityData
          });
        return updatedPseUserPreparatoryWorkEntity;
      })
    );
  });
}