import type { UserOnPseFormationEntity } from "~/entity";
import type { UserOnPseFormationApiObject } from "~/apiobject/useronpseformation.apiobject";
import { userOnPseFormationEntityToApiObject } from "~/mapper/useronpseformation.mapper";
import { findUserOnPseFormationEntityById } from "~/repository/useronpseformation.repository";
import { NotFoundException } from "./api.error";


export async function getUserOnPseFormationEntityById(formationId: string, userId: string): Promise<UserOnPseFormationApiObject> {
  const userOnPseFormationEntity: Optional<UserOnPseFormationEntity> = await findUserOnPseFormationEntityById(userId, formationId);
  if (userOnPseFormationEntity == null) {
    throw new NotFoundException("UserOnPseFormationEntity", userId);
  }
  return userOnPseFormationEntityToApiObject(userOnPseFormationEntity);
}