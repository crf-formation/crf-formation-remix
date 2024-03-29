import { prisma } from "~/entity/db.server";
import type { PseCompetenceEntity } from "~/entity";

export async function getPseCompetenceEntites(): Promise<Array<PseCompetenceEntity>> {
  return await prisma.pseCompetence.findMany({
    where: {},
    // include: {
    // },
    orderBy: { id: "asc" }
  });
}