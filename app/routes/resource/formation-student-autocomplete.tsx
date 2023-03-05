import { useFetcher } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useEffect } from "react";
import { z } from "zod";
import type PaginateObject from '~/constant/types';
import type { UserDto } from "~/dto/user.dto";
import { getSearchParamsOrFail } from "~/helper/remix.params.helper";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { userApiObjectToDto } from "~/mapper/user.mapper";
import { requireUser } from "~/service/session.server";
import { getFormationStudents, searchFormationStudents } from "~/service/user.server";

const URLSearchParamsSchema = z.object({
	formationId: z.string(),
	query: z.string().optional(),
  page: z.number().optional().default(0),
  pageSize: z.number().optional().default(25),
	orderBy: z.string().optional().default("createdAt"),
	orderByDirection: z.enum([ 'asc', 'desc']).optional().default("desc"),
})

export async function loader({ request }: LoaderArgs) {
  await requireUser(request);

	const { formationId, query, page, pageSize, orderBy, orderByDirection } = getSearchParamsOrFail(request, URLSearchParamsSchema)

  if (!query || query.length === 0) {
    const usersPaginatedObjectApiObject = await getFormationStudents(formationId, page, pageSize, orderBy, orderByDirection)
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

	const usersPaginatedObjectApiObject = await searchFormationStudents(formationId, query as string, page, pageSize, orderBy, orderByDirection)
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

interface OtherProps {
  children: (props: {
    usersPaginateObject?: PaginateObject<UserDto>;
    isLoading: boolean;
  }) => JSX.Element;
}

// TODO: can we transform this to a hook?
export default function FormationStudentAutocompleteResource(props: z.infer<typeof URLSearchParamsSchema> & OtherProps) {
	const fetcher = useFetcher<typeof loader>()
	const data = fetcher.data

  // on mount, load all students
  useEffect(() => {
    fetcher.submit(
      {
        formationId: props.formationId,
        query: null,
        page: 0,
        pageSize: 50,
        // TODO:
        // orderBy: props.orderBy,
        // orderByDirection: props.orderByDirection,
      },
      { method: "get", action: "/resource/formation-student-autocomplete" }
    );
  	// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // on query change
	useEffect(() => {
    // TODO: add debounce
		// if (props.query?.length > 0) {
      fetcher.submit(
        {
          formationId: props.formationId,
          query: props.query,
          page: 0,
          pageSize: 50,
          // TODO:
          // orderBy: props.orderBy,
          // orderByDirection: props.orderByDirection,
        },
        { method: "get", action: "/resource/formation-student-autocomplete" }
      );
    // }
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ props.query, fetcher.submit ])

	const isLoading = fetcher.state !== 'idle'

  return props.children({ isLoading, usersPaginateObject: data?.usersPaginateObject })
}
