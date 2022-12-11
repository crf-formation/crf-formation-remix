import { createTheme } from '@mui/material/styles';
import { CLOSED_DRAWER_WIDTH, DRAWER_WIDTH } from '~/constants';
import { teal, red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: red,
    secondary: teal,
  },
  sidebar: {
    width: DRAWER_WIDTH, 
    closedWidth: CLOSED_DRAWER_WIDTH, 
  },

});

export default theme;
