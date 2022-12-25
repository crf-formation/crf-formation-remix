import { useFetcher } from "@remix-run/react";
import type { LoaderArgs} from "@remix-run/server-runtime";
import { json} from "@remix-run/server-runtime";
import { useEffect } from "react";
import { requireUser } from "~/services/session.server";
import { pseConcreteCaseTypeApiObjectToDto } from '../../mapper/pseconcretecasetype.mapper';
import { getPseConcreteCaseTypes } from "~/services/pseconcretecasetypes.server";
import type { PseConcreteCaseTypeDto } from "~/dto/pseconcretecasetype.dto";

export async function loader({ request }: LoaderArgs) {
  await requireUser(request);

	const pseConcreteCaseTypeApiObjects = await getPseConcreteCaseTypes()
  return json({
		pseConcreteCaseTypes: pseConcreteCaseTypeApiObjects.map(pseConcreteCaseTypeApiObjectToDto)
  });
}

interface Props {
  children: (props: {
    pseConcreteCaseTypes?: Array<PseConcreteCaseTypeDto>;
    isLoading: boolean;
  }) => JSX.Element;
}

// TODO: can we transform this to a hook?
export default function FormationTeacherAutocompleteResource(props: Props) {
	const fetcher = useFetcher<typeof loader>()
	const data = fetcher.data

  // on mount, load all teachers
  useEffect(() => {
    fetcher.submit(
      {
      },
      { method: "get", action: "/resource/pse-concrete-case-type-autocomplete" }
    );
  	// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // on query change
	// useEffect(() => {
  //   // TODO: add debounce
	// 	// if (props.query?.length > 0) {
  //     fetcher.submit(
  //       {
  //         formationId: props.formationId,
  //         query: props.query,
  //         page: 0,
  //         pageSize: 50,
  //         // TODO:
  //         // orderBy: props.orderBy,
  //         // orderByDirection: props.orderByDirection,
  //       },
  //       { method: "get", action: "/resource/pse-concrete-case-type-autocomplete" }
  //     );
  //   // }
	// // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [ props.query, fetcher.submit ])

	const isLoading = fetcher.state !== 'idle'

  return props.children({ isLoading, pseConcreteCaseTypes: data?.pseConcreteCaseTypes })
}
