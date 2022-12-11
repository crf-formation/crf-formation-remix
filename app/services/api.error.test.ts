import { toApiError } from './api.error';

test("create 404 api error", () => {
	const jsonResponse = {
    timestamp: '2022-10-24T09:49:37.657+00:00',
    status: 404,
    error: 'Not Found',
    path: 'PATH'
  }
	const error = toApiError(404, jsonResponse)

	expect(error).not.toBeNull()
	expect(error.message).toBe("Not Found: PATH")
});
