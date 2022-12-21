import { InternalServerException } from "~/services/api.error";


export function assertEnum<T>(value: string, arrayOfEnumValues: Array<T>): T {
	if (!arrayOfEnumValues.includes(value as T)) {
		throw new InternalServerException(`Enum value "${value}" does not exists on ${arrayOfEnumValues.join(', ')}`);
	}

	return value as T
}