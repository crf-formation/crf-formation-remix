import type { PseConcreteCaseGroupApiObject, PseConcreteCaseGroupPostApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import { createPseConcreteCaseGroupEntity, findPseConcreteCaseGroupEntity } from "~/repository/pseconcretecasegroup.repository";
import { pseConcreteCaseGroupEntityToApiObject } from "~/mapper/pseconcretecasegroup.mapper";
import { NotFoundException } from "./api.error";


export async function createPseConcreteCaseGroup(
	pseConcreteCaseGroupPostApiObject: PseConcreteCaseGroupPostApiObject
): Promise<PseConcreteCaseGroupApiObject> {
  // TODO: verify students are valid and exists

	const entity = await createPseConcreteCaseGroupEntity(pseConcreteCaseGroupPostApiObject);
  return pseConcreteCaseGroupEntityToApiObject(entity)
}

export async function getPseConcreteCaseGroup(id: string): Promise<Optional<PseConcreteCaseGroupApiObject>> {
  const entity = await findPseConcreteCaseGroupEntity(id);
  if (entity == null) {
		throw new NotFoundException('PseConcreteCaseGroupEntity', id)
  }
  return pseConcreteCaseGroupEntityToApiObject(entity)

}