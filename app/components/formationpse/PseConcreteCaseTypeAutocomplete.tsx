import { TextField } from "@mui/material";
import type { AutocompleteProps } from "@mui/material/Autocomplete";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
import type { PseConcreteCaseTypeDto } from "~/dto/pseconcretecasetype.dto";
import PseConcreteCaseTypeAutocompleteResource from "~/routes/resource/pse-concrete-case-type-autocomplete";

interface Props extends AutocompleteProps {
  multiple: boolean;
  name?: string;
  // TODO: type - make it depend of multiple
  defaultValue?: PseConcreteCaseTypeDto | Array<PseConcreteCaseTypeDto>;
}

function ContentMultiple({ pseConcreteCaseTypes, isLoading, name, defaultValue, query, setQuery, ...otherProps }) {
  const [selectedUsers, setSelectedUsers] = useState<Array<PseConcreteCaseTypeDto>>(defaultValue || []);

  return (
    <>
      {/* TODO: handle isLoading */}
      <Autocomplete
        disablePortal
        fullWidth
        multiple
        value={selectedUsers}
        onChange={(e, selectedOptions) => setSelectedUsers(selectedOptions)}
        getOptionLabel={(option) => option.name}
        options={pseConcreteCaseTypes || []}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Types de cas concret"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        {...otherProps}
      />
      {selectedUsers.map((user: PseConcreteCaseTypeDto) => (
        <input key={user.id} type="hidden" name={`${name}`} value={user.id} />
      ))}
    </>
  );
}


function ContentSingle({ pseConcreteCaseTypes, isLoading, name, defaultValue, query, setQuery, ...otherProps }) {
  const [selectedUser, setSelectedUser] = useState<PseConcreteCaseTypeDto | null>(defaultValue || null);

  return (
    <>
      {/* TODO: handle isLoading */}
      <Autocomplete
        disablePortal
        fullWidth
        multiple={false}
        value={selectedUser}
        onChange={(e, selectedOption) => setSelectedUser(selectedOption)}
        getOptionLabel={(option) => option.name}
        options={pseConcreteCaseTypes || []}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Type de cas concret"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        {...otherProps}
      />
      {selectedUser && (
        <input key={selectedUser.id} type="hidden" name={`${name}`} value={selectedUser.id} />
      )}
    </>
  );
}

export default function PseConcreteCaseTypeAutocomplete({
  name,
  multiple,
  defaultValue,
  ...otherProps
}: Props) {
  const [query, setQuery] = useState("");

  return (
    <PseConcreteCaseTypeAutocompleteResource query={query}>
      {({ pseConcreteCaseTypes, isLoading }) =>
        isLoading ? (
          // TODO: loading
          <span />
        ) : multiple ? (
          <ContentMultiple
          pseConcreteCaseTypes={pseConcreteCaseTypes}
            isLoading={isLoading}
            name={name}
            query={query}
            setQuery={setQuery}
            defaultValue={defaultValue}
            {...otherProps}
          />
        ) : (
          <ContentSingle
            pseConcreteCaseTypes={pseConcreteCaseTypes}
            isLoading={isLoading}
            name={name}
            query={query}
            setQuery={setQuery}
            defaultValue={defaultValue}
            {...otherProps}
          />
        )
      }
    </PseConcreteCaseTypeAutocompleteResource>
  );
}
