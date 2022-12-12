import type { User as UserEntity } from "@prisma/client";
import type { UserApiObject, UserPostApiObject, UserPutApiObject, UserRoleApiEnum, UserStateApiEnum } from "~/apiobject/user.apiobject";
import type { UserDto, UserMeDto, UserPostDto, UserPutDto } from "~/dto/user.dto";

export function userPostDtoToUserPostApiObject(dto: UserPostDto): UserPostApiObject {
	return {
		firstName: dto.firstName,
		lastName: dto.lastName,
		email: dto.email,
		state: 'CREATED',
		role: 'USER',
	}
}

export function userPutDtoToUserPutApiObject(dto: UserPutDto): UserPutApiObject {
	return {
		state: dto.state,
		role: dto.role,
		email: dto.email,
		firstName: dto.firstName,
		lastName: dto.lastName,
	}
}

export function userEntityToUserApiObject(userEntity: UserEntity): UserApiObject {
	return {
		id: userEntity.id,
		state: stringToUserStateApiEnum(userEntity.state),
		role: stringToUserRoleApiEnum(userEntity.role),
		email: userEntity.email,
		firstName: userEntity.firstName,
		lastName: userEntity.lastName,
		createdAt: userEntity.createdAt,
		updatedAt: userEntity.updatedAt,
	}
}

export function userApiObjectToUserMeDto(userEntity: UserEntity): UserMeDto {
	return {
		id: userEntity.id,
		state: stringToUserStateApiEnum(userEntity.state),
		role: stringToUserRoleApiEnum(userEntity.role),
		email: userEntity.email,
		firstName: userEntity.firstName,
		lastName: userEntity.lastName,
		createdAt: userEntity.createdAt.toISOString(),
		updatedAt: userEntity.updatedAt.toISOString(),
	}
}

export function userApiObjectToUserDto(userApiObject: UserApiObject): UserDto {
	return {
		id: userApiObject.id,
		state: userApiObject.state,
		role: userApiObject.role,
		email: userApiObject.email,
		firstName: userApiObject.firstName,
		lastName: userApiObject.lastName,
		createdAt: userApiObject.createdAt.toISOString(),
		updatedAt: userApiObject.updatedAt.toISOString(),
	}
}

export function dataToUserPutDto(data: any): UserPutDto {
	return {
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		state: data.state,
		role: data.role,
	};
}

function stringToUserRoleApiEnum(role: string): UserRoleApiEnum {
	// TODO: enforce validity
	return role as UserRoleApiEnum
}

function stringToUserStateApiEnum(state: string): UserStateApiEnum {
	// TODO: enforce validity
	return state as UserStateApiEnum
}
