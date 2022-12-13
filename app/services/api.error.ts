
export function toApiError(status: number, jsonResponse: any): ApiErrorException | null {
	if (status === 403) {
    return new ForbiddenException(jsonResponse);
  } else if (status === 500) {
    return new InternalServerException(jsonResponse);
  } 

  return new ApiErrorException('', jsonResponse, status);
}

export interface ApiError {
  status: number;
  localizedMessage: string;
  errorCode: string;
  apiMessage: string;
  extra: any;
	jsonResponse: any;
}

export class ApiErrorException extends Error {
  status: number;
  localizedMessage: string;
  errorCode: string;
  apiMessage: string;
  extra: any;
	jsonResponse: any;

  constructor(additionnalMessage: any, jsonResponse: any, status: number) {
		const messages = [
			jsonResponse.localizedMessage,
			(jsonResponse.errorCode && jsonResponse.message) && `${jsonResponse.errorCode}: ${jsonResponse.message}`,
			jsonResponse.message && jsonResponse.message,
			jsonResponse.errorCode && jsonResponse.errorCode,
			jsonResponse.error,
		].filter(Boolean)

    const responseMessage = messages[0]

		const message = `${responseMessage}: ${additionnalMessage}`;

		console.log({
			messages,
			message,
			additionnalMessage,
			responseMessage,
			jsonResponse
		})

    super(message)
  
    this.status = status

    this.localizedMessage = jsonResponse.localizedMessage
    this.errorCode = jsonResponse.errorCode
    this.extra = jsonResponse.extra
		// renamed to apiMessage to not override error.message
    this.apiMessage = jsonResponse.message
		this.jsonResponse = jsonResponse
  }

}

export class NotFoundException extends ApiErrorException {
  constructor(entity: string, id: string) {
    super(`Not found ${entity}`, id, 404);
  }
}

export class InternalServerException extends ApiErrorException {
  constructor(message: string) {
    super(message, null, 500);
  }
}

export class ForbiddenException extends ApiErrorException {
  constructor(message: string) {
    super(message, null, 403);
  }
}
