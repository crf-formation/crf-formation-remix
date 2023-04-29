import type { PseTechniqueApiObject } from "~/apiobject/psetechnique.apiobject";
import { findPseTechniques } from "~/repository/psetechnique.repository";
import { pseTechniqueEntityToApiObject } from "../mapper/psetechnique.mapper";

export async function getPseTechniques(): Promise<Array<PseTechniqueApiObject>> {
  const techniqueEntities = await findPseTechniques();

  return techniqueEntities.map(pseTechniqueEntityToApiObject);
}