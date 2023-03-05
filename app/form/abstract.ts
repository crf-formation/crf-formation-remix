import type { TypedResponse } from "@remix-run/server-runtime";
import type { ValidationErrorResponseData, Validator, ValidatorError } from "remix-validated-form";
import { validationError } from "remix-validated-form";

export type ValidatedFormData<T> = {
	data: T

	errorResponse: undefined
	error: undefined
}

export type ValidatedFormError = {
	data: undefined

	errorResponse: TypedResponse<ValidationErrorResponseData>
	error: ValidatorError
}

export type ValidatedForm<T> = ValidatedFormData<T> | ValidatedFormError

export async function validateForm<T>(request: Request, validator: Validator<any>): Promise<ValidatedForm<T>> {
	const result = await validator.validate(await request.formData());

	if (result.error) {
		const errorResult: ValidatedFormError = {
			data: undefined,
			error: result.error,
			errorResponse: validationError(result.error),	
		}
		return errorResult
	}

	const validatedForm: ValidatedForm<T> = {
		data: result.data as T,
		error: undefined,
		errorResponse: undefined,
	}

	return validatedForm
}
