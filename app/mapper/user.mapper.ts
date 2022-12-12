import type { User as UserEntity } from "@prisma/client";
import type { UserApiObject, UserPostApiObject, UserPutApiObject, UserStateApiEnum } from "~/apiobject/user.apiobject";
import type { UserDto, UserPostDto, UserPutDto } from "~/dto/user.dto";

export function userPostDtoToUserPostApiObject(dto: UserPostDto): UserPostApiObject {
	return {
		firstName: dto.firstName,
		lastName: dto.lastName,
		email: dto.email,
		state: 'CREATED'
	}
}

export function userPutDtoToUserPutApiObject(dto: UserPutDto): UserPutApiObject {
	return {
		state: dto.state,
		email: dto.email,
		firstName: dto.firstName,
		lastName: dto.lastName,
	}
}

export function userEntityToUserApiObject(userEntity: UserEntity): UserApiObject {
	return {
		id: userEntity.id,
		state: userEntity.state as UserStateApiEnum,
		email: userEntity.email,
		firstName: userEntity.firstName,
		lastName: userEntity.lastName,
		createdAt: userEntity.createdAt,
		updatedAt: userEntity.updatedAt,
	}
}

export function userApiObjectToUserDto(userApiObject: UserApiObject): UserDto {
	return {
		id: userApiObject.id,
		state: userApiObject.state,
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
	};
}