import type { Params } from "@remix-run/react";

// https://github.com/sergiodxa/remix-utils/blob/145da9294d80221d1860bca78d7c75648c111954/src/server/named-action.ts
type Actions = Record<string, (request: Request, params: Params) => Promise<Response>>;


/**
 * Runs an action based on the request's action name
 * @param request The request to parse for an action name
 * @param actions The map of actions to run
 * @returns The response from the action
 * @throws {ReferenceError} Action name not found
 * @throws {ReferenceError} Action "${name}" not found
 */
export async function namedActionWithFormType(
  request: Request,
	params: Params,
  actions: Actions
): Promise<Response> {
  return await run(await request.clone().formData(), request, params, actions);
}

/**
 * Runs an action based on the request's action name
 * @param request The request to parse for an action name
 * @param actions The map of actions to run
 * @returns The response from the action
 * @throws {ReferenceError} Action name not found
 * @throws {ReferenceError} Action "${name}" not found
 */
export async function namedAction(
  request: Request,
	params: Params,
  actions: Actions
) {
	return await run(request, request, params, actions); 
}

async function run(
	input: Request | FormData,
	request: Request,
	params: Params,
  actions: Actions
) {
	let name = await getActionName(input);

  if (name && name in actions) return await actions[name](request, params);

  if (name === null && "default" in actions) return await actions["default"](request, params);

  if (name === null) throw new ReferenceError("Action name not found");

  throw new ReferenceError(`Action "${name}" not found`);
}

async function getActionName(
  input: Request | URL | URLSearchParams | FormData
): Promise<string | null> {

  if (input instanceof Request) {
    let actionName = findNameInURL(new URL(input.url).searchParams);
    if (actionName) return actionName;

    if (input.headers.get("Content-Type")?.includes("form")) {
      actionName = findNameInFormData(await input.clone().formData());
      if (actionName) return actionName;
    }

    return findNameUsingMethod(input.method)
  }

  if (input instanceof URL) {
    return findNameInURL(input.searchParams);
  }

  if (input instanceof URLSearchParams) {
    return findNameInURL(input);
  }

  if (input instanceof FormData) {
    return findNameInFormData(input);
  }

  return null;
}

function findNameInURL(searchParams: URLSearchParams) {
  for (let key of searchParams.keys()) {
    if (key.startsWith("/")) return key.slice(1);
  }

  let actionName = searchParams.get("intent");
  if (typeof actionName === "string") return actionName;

  actionName = searchParams.get("action");
  if (typeof actionName === "string") return actionName;

  actionName = searchParams.get("_action");
  if (typeof actionName === "string") return actionName;

  return null;
}

function findNameInFormData(formData: FormData) {
  for (let key of formData.keys()) {
    if (key.startsWith("/")) return key.slice(1);
  }

	let actionName = formData.get("formType");
  if (typeof actionName === "string") return `action${actionName.charAt(0).toUpperCase() + actionName.slice(1)}`;

  actionName = formData.get("intent");
  if (typeof actionName === "string") return actionName;

  actionName = formData.get("action");
  if (typeof actionName === "string") return actionName;

  actionName = formData.get("_action");
  if (typeof actionName === "string") return actionName;

  return null;
}

function findNameUsingMethod(method: string): string  | null {
	switch (method.toLocaleLowerCase()) {
    case "post":
      return "postAction";
    case "put":
      return "putAction";
    case "delete":
      return "deleteAction";
		default:
			return null;
  }
}
