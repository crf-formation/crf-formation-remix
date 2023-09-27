import type { AutocompleteProps } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState } from "react";

// PseConcreteCaseSessionStateDtoEnum

export default function PseConcreteCaseSessionStateAutocomplete({ defaultValue, name, ...props }: AutocompleteProps) {

  const options = [
    { value: "CREATED", label: "Non commencé" },
    { value: "RUNNING", label: "En cours" },
    { value: "CLOSED", label: "Fermé" }
  ];

  const [state, setState] = useState(options.find(option => option.value === defaultValue));

  return (
    <>
      <Autocomplete
        getOptionLabel={(option) => option.label}
        disablePortal
        options={options}
        value={state}
        onChange={(e, option) => setState(option)}
        renderInput={(params) => <TextField {...params} label={props.label} />}
        {...props}
      />
      <input type="hidden" name={name} value={state?.value} />
    </>
  );
}