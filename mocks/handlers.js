// https://mswjs.io/docs/getting-started/mocks/rest-api
import { rest } from 'msw'

const REMIX_DEV_PING = new URL(
	process.env.REMIX_DEV_ORIGIN
);
REMIX_DEV_PING.pathname = "/ping";

export const handlers = [
	// https://remix.run/docs/en/main/other-api/dev#how-to-set-up-msw
	rest.post(REMIX_DEV_PING.href, (req) => req.passthrough()),

  // Handles a GET /user request
  rest.post('/notionToMd', (req, res, ctx) => {
		return res(
			ctx.status(403),
			ctx.json({
				errorMessage: 'Not authorized',
			}),
		)
	}),

]

