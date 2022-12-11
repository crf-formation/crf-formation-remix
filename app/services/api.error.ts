
export function toApiError(status: number, jsonResponse: any): ApiErrorException | null {
	if (status === 404) {
    return new NotFoundApiError(jsonResponse);
  } else if (status === 500) {
    return new InternalServerApiError(jsonResponse);
  } else if (status >= 400) {
    return new ApiErrorException('', jsonResponse, status);
  }

	return null;
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

export class NotFoundApiError extends ApiErrorException {
  constructor(jsonResponse: any) {
    super(jsonResponse.path, jsonResponse, 404);
  }
}

export class InternalServerApiError extends ApiErrorException {
  constructor(jsonResponse: any) {
    super(jsonResponse.extra?.stackMessage, jsonResponse, 500);
  }
}

