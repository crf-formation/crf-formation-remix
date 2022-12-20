import { TextField } from "@mui/material"
import { useState } from "react"
import UserAutocompleteResource from "~/routes/resource/formation-student-autocomplete"
import Autocomplete from '@mui/material/Autocomplete';
import type { UserDto } from '../../dto/user.dto';

interface Props { 
  formationId: string, 
  name?: string,
}

export default function FormationUserAutocomplete({ formationId, name ="students" }: Props) {
	const [query, setQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<UserDto>([])

  return (
    <UserAutocompleteResource query={query} formationId={formationId}>
      {({ usersPaginateObject, isLoading }) => (
        <>
          {/* TODO: handle isLoading */}
          <Autocomplete
            disablePortal
            multiple
            fullWidth
            value={selectedUsers}
            onChange={(e, selectedOptions) => setSelectedUsers(selectedOptions)}
            getOptionLabel={(option) => option.fullName}
            options={(usersPaginateObject?.data || [])}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Participants" fullWidth value={query} onChange={e => setQuery(e.target.value)} />
            )}
          />
          {selectedUsers.map((user: UserDto, index) => (
            <input key={user.id} type="hidden" name={`${name}`} value={user.id} />
          ))}
        </>
      )}
    </UserAutocompleteResource>
  );
}