// https://mswjs.io/docs/getting-started/mocks/rest-api
import { rest } from 'msw'

export const handlers = [

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

