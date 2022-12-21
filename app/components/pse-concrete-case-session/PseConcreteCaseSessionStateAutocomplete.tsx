import type { AutocompleteProps} from "@mui/material";
import { Autocomplete, TextField } from "@mui/material";

// PseConcreteCaseSessionStateDtoEnum

export default function PseConcreteCaseSessionStateAutocomplete({ defaultValue, ...props }: AutocompleteProps) {
	const options = [
		{ value: 'CREATED', label: 'Non commencé' },
		{ value: 'RUNNING', label: 'En cours' },
		{ value: 'CLOSED', label: 'Fermé' },
	]
  return (
    <Autocomplete
			getOptionLabel={(option) => option.label}
      disablePortal
      options={options}
			defaultValue={options.find(option => option.value === defaultValue)}
      renderInput={(params) => <TextField {...params} label={props.label} />}
			{...props}
    />
  );
}