import type { PseModuleEntity } from "~/entity";
import { prisma } from "~/entity/db.server";

export async function getPseModuleEntities(): Promise<Array<PseModuleEntity>> {
  return await prisma.pseModule.findMany({
    where: {},
  });
}

export async function getPseModuleEntityByModuleId(moduleId: string): Promise<Optional<PseModuleEntity>> {
  return await prisma.pseModule.findUnique({
    where: { moduleId },
  });
}