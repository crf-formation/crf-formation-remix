import type { PseModuleEntity } from "~/apiobject/entity";
import { prisma } from "~/db.server";


export async function getPseModuleEntityByModuleId(moduleId: string): Promise<Optional<PseModuleEntity>> {
  return await prisma.pseModule.findUnique({
    where: { moduleId },
  });
}