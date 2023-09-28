import type { PathParams } from "msw";
import { rest } from "msw";
import { isFunction } from "lodash";

// https://stackoverflow.com/questions/48011353/how-to-unwrap-the-type-of-a-promise
// https://stackoverflow.com/questions/60879582/typescript-type-t-does-not-satisfy-the-constraint-args-any-any
export type ApiManagerResponseType<
  T extends (...args: any[]) => any
> = Awaited<Promise<ReturnType<T>>>;

export type ResponseBuilder = (
  params: PathParams
) => ApiManagerResponseType<any>;

export function mockGet<
  ApiMethod extends (...args: any[]) => any
>(
  endpoint: string,
  response:
    | ApiManagerResponseType<ApiMethod>
    | ResponseBuilder
) {
  const url = "**"; // TODO: use .env api url

  return rest.get(`${url}${endpoint}`, ({ params }) => {
    return mockJson<
      ApiManagerResponseType<ApiMethod>
    >(endpoint, "GET", response, params);
  });
}

export function mockJson<ExtDto>(
  endpoint: string,
  method: string,
  response: ExtDto | ResponseBuilder,
  params: PathParams
) {
  console.info(`Mocking ${method} ${endpoint}`);

  try {
    const body = isFunction(response) ? response(params) : response;

    return new Response(JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (e) {
    if (isMockedError(e)) {
      return new Response(JSON.stringify(e.body), {
        headers: {
          "Content-Type": "application/json",
        },
        status: e.status,
      });
    }

    return new Response(null, {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
}

class MockedError {
  public status: number;
  public body: any;

  constructor(status: number, body: any) {
    this.status = status;
    this.body = body;
  }
}

function isMockedError(e: unknown): e is MockedError {
  const error = e as MockedError;
  return error.status !== undefined || error.body !== undefined;
}

export function mock404() {
  throw new MockedError(404, {
    errorCode: "HTTP_404",
    message: "Couldn't find object",
    localizedMessage: null,
    sessionId: "mocked-sessionId-559d39a25b673b589c36513343e39b9a",
    extras: {},
  });
}
