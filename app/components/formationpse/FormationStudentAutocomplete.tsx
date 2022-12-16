import { TextField } from "@mui/material"
import { useState } from "react"
import UserAutocompleteResource from "~/routes/resource/formation-student-autocomplete"
import Autocomplete from '@mui/material/Autocomplete';
import type { UserDto } from "~/dto/user.dto";

interface Props { 
  formationId: string, 
  name: string,
  // onSelect 
}

export default function FormationUserAutocomplete({ formationId, name ="students", onSelect }: Props) {
	const [query, setQuery] = useState("Flo") // TODO: ""
  const [users, setUsers] = useState([])

	// return (
  //   <div>
  //     <TextField
  //       name="query"
	// 			value={query}
	// 			onChange={e => setQuery(e.target.value)}
  //       label="Rechercher un utilisateur"
  //       variant="standard"
  //       margin="normal"
  //       type="string"
  //       autoFocus
  //     />
  //     <FormationUserAutocompleteResource formationId={formationId} query={query} />
  //   </div>
  // );

  return (
    <UserAutocompleteResource query={query} formationId={formationId}>
      {({ usersPaginateObject }) => (
        <>
          <Autocomplete
            disablePortal
            multiple
            onChange={(e, value) => setUsers(value)}
            options={(usersPaginateObject?.data || []).map((user: UserDto) => ({
              label: user.fullName,
              value: user,
            }))}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Participants" value={query} onChange={e => setQuery(e.target.value)} />
            )}
          />
          {users.map((user, index) => (
            <input key={index} type="hidden" name={`[${name}][${user.index}]`} />
          ))}
        </>
      )}
    </UserAutocompleteResource>
  );
}