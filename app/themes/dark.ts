import { createTheme } from '@mui/material/styles';
import { CLOSED_DRAWER_WIDTH, DRAWER_WIDTH } from '~/constants';
import { teal, orange } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: teal,
    secondary: orange
  },
  sidebar: {
    width: DRAWER_WIDTH, 
    closedWidth: CLOSED_DRAWER_WIDTH, 
  },

});

export default theme;
