
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

  constructor(prefixMessage: any, jsonResponse: any, status: number) {
		const messages = [
			jsonResponse.localizedMessage,
			(jsonResponse.errorCode && jsonResponse.message) && `${jsonResponse.errorCode}: ${jsonResponse.message}`,
			jsonResponse.message && jsonResponse.message,
			jsonResponse.errorCode && jsonResponse.errorCode,
			jsonResponse.error,
      JSON.stringify(jsonResponse)
		].filter(Boolean)

    const responseMessage = messages[0]

		const message = `${prefixMessage}: ${responseMessage}`;

		console.log({
			messages,
			message,
			prefixMessage,
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
    super(`Not found ${entity}`, { entity, id }, 404);
  }
}

export class BadRequestException extends ApiErrorException {
  constructor(message: string, json: any) {
    super(message, json, 400);
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
