import { createTheme } from '@mui/material/styles';
import { teal, red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: red,
    secondary: teal,
  },
});

export default theme;
