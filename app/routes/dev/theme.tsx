import HelpIcon from "@mui/icons-material/Help";
import { Box, Button, IconButton, Tab, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import type { MetaFunction } from "@remix-run/server-runtime";
import Section from "~/component/layout/Section";
import SubHeaderBar from "~/component/layout/SubHeaderBar";
import Callout from "~/component/typography/Callout";
import useTheme from "~/hooks/useTheme";
import AppTabs from '../../components/layout/AppTabs';
import PageContainer from '../../components/layout/PageContainer';

export const meta: MetaFunction<typeof loader> = () => {
  return {
    title: "Thème",
  };
};

export default function Theme() {
  const theme = useTheme();

  return (
    <>
      <SubHeaderBar>
        <Grid item>
          <Button variant="outlined" color="inherit" size="small">
            Web setup
          </Button>
        </Grid>
        <Grid item>
          <Tooltip title="Help">
            <IconButton color="inherit">
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </SubHeaderBar>

      <AppTabs value={1}>
        <Tab label="Users" />
        <Tab label="Sign-in method" />
        <Tab label="Templates" />
        <Tab label="Usage" />
      </AppTabs>

      <PageContainer>
        <Section>
          <Box p={2}>
            <Typography variant="h1" color="primary">
              Responsive h1 primary
            </Typography>
            <Typography variant="h2" color="secondary">
              Responsive h2 secondary
            </Typography>
            <Typography variant="h3" color="error.">
              Responsive h3 error
            </Typography>
            <Typography variant="h4" color="warning.main">
              Responsive h4 warning
            </Typography>
            <Typography variant="h5" color="info.main">
              Responsive h5 info
            </Typography>
            <Typography variant="h6" color="success.main">
              Responsive h6 success
            </Typography>

            <Callout severity="info" withIcon>
              info callout
            </Callout>
            <Callout severity="warning" withIcon>
              Warning callout
            </Callout>
            <Callout severity="error" withIcon>
              error callout
            </Callout>

            <Callout severity="success" withIcon>
              Success callout
            </Callout>

            <Callout severity="error" withIcon>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
              cupiditate, aliquam corporis, sint ullam optio corrupti animi ipsa
              repellendus asperiores sequi. Cupiditate beatae magni delectus
              molestiae quasi? Autem, distinctio nostrum!
            </Callout>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" color="primary">
                primary contained
              </Button>

              <Button variant="outlined" color="primary">
                primary contained
              </Button>

              <Button variant="text" color="primary">
                primary contained
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button variant="contained" color="secondary">
                secondary contained
              </Button>

              <Button variant="outlined" color="secondary">
                secondary contained
              </Button>

              <Button variant="text" color="secondary">
                secondary contained
              </Button>
            </Box>

            <Box mt={6}>
              {/* TODO: can use tree component 
          https://github.com/mui/material-ui/blob/master/docs/data/material/customization/default-theme/DefaultTheme.js
         */}
              <pre>{JSON.stringify(theme, null, 2)}</pre>
            </Box>
          </Box>
        </Section>
      </PageContainer>
    </>
  );
}
