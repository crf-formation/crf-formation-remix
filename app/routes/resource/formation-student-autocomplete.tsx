import { useFetcher } from "@remix-run/react";
import type { LoaderArgs} from "@remix-run/server-runtime";
import { json} from "@remix-run/server-runtime";
import { useEffect } from "react";
import { z } from "zod";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { userApiObjectToDto } from "~/mapper/user.mapper";
import { requireUser } from "~/services/session.server";
import { searchFormationStudents } from "~/services/user.server";
import { getSearchParamsOrFail } from "~/utils/remix.params";

const URLSearchParamsSchema = z.object({
	formationId: z.string(),
	query: z.string(),
  page: z.number().optional().default(0),
  pageSize: z.number().optional().default(25),
	orderBy: z.string().optional().default("createdAt"),
	orderByDirection: z.enum([ 'asc', 'desc']).optional().default("desc"),
})

export async function loader({ request }: LoaderArgs) {
  await requireUser(request);

	const { formationId, query, page, pageSize, orderBy, orderByDirection } = getSearchParamsOrFail(request, URLSearchParamsSchema)

	const usersPaginatedObjectApiObject = await searchFormationStudents(formationId, query, page, pageSize, orderBy, orderByDirection)
  return json({
    formationId,
    query, 
    page,
    pageSize, 
    orderBy, 
    orderByDirection,
		usersPaginateObject: paginateEntityToApiObject(usersPaginatedObjectApiObject, userApiObjectToDto)
  });
}

// TODO: can we transform this to a hook?
export default function FormationStudentAutocompleteResource(props: z.infer<typeof URLSearchParamsSchema>) {
	const fetcher = useFetcher<typeof loader>()
	const data = fetcher.data

	useEffect(() => {
    // TODO: add debounce
		if (props.query?.length > 0) {
      fetcher.submit(
        {
          formationId: props.formationId,
          query: props.query,
          // TODO:
          // page: props.page,
          // pageSize: props.pageSize,
          // orderBy: props.orderBy,
          // orderByDirection: props.orderByDirection,
        },
        { method: "get", action: "/resource/formation-student-autocomplete" }
      );
    }
	}, [ props.query, fetcher.submit ])

	const isLoading = fetcher.state !== 'idle'

	// return (
  //   <div>
  //     {isLoading ? "LOADING" : "LOADED"}
  //     <pre>{JSON.stringify(data, null, 2)}</pre>
  //   </div>
  // );
  return props.children(data || {})
}
