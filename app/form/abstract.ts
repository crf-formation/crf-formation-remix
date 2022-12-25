import type { TypedResponse } from "@remix-run/server-runtime";
import type { ValidationErrorResponseData, ValidatorError, Validator } from "remix-validated-form";
import { validationError } from "remix-validated-form";

type ValidatedForm<T> = {
	data: T
} | {
	errorResponse?: TypedResponse<ValidationErrorResponseData>
	error: Optional<ValidatorError>
}

export async function validateForm<T>(request: Request, validator: Validator<any>): Promise<ValidatedForm<T>> {
	const result = await validator.validate(
		await request.formData()
	);

	if (result.error) {
		const errorResult: ValidatedForm<T> = {
			error: result.error,
			errorResponse: result.error && validationError(result.error),	
		}
		return errorResult
	}

	const validatedForm: ValidatedForm<T> = {
		data: result.data as T,
	}

	return validatedForm
}