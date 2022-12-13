import { Avatar, Badge, Box, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { Image as ImageIcon, People as PeopleIcon } from '@mui/icons-material';
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import PageContainer from "~/components/layout/PageContainer";
import Section from "~/components/layout/Section";
import Callout from "~/components/typography/Callout";
import type { UserDto } from "~/dto/user.dto";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { findPseFormationById } from "~/services/pseformation.server";
import { assertUserHasAccessToFormation } from "~/services/security.server";
import { requireUser } from "~/services/session.server";
import Property from "~/components/typography/Property";
import type { PseFormationDto } from "~/dto/pseformation.dto";
import useI18n from "~/hooks/useI18n";
import FormationPseStatusChip from "~/components/formationpse/FormationPseStatusChip";

// GET a formation
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	invariant(params.formationId, `Missing formationId parameter`)

	const user = await requireUser(request)

	const pseFormationApiObject = await findPseFormationById(params.formationId)
	
	if (!pseFormationApiObject) {
		throw new Error(`Formation not found: ${params.formationId}`);
	}
	
	await assertUserHasAccessToFormation(user.id, pseFormationApiObject.id)

  return json({
		formation: pseFormationApiObjectToDto(pseFormationApiObject)
	});
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `PSE - ${data.formation.title}`,
  };
};

function TeacherList({ teachers }: { teachers: Array<UserDto> }) {
  return (
    <Section title={<span>Teachers ({teachers.length})</span>}>
      {teachers.length === 0 && (
        <Callout severity="warning">Aucun formateur n'a été configuré</Callout>
      )}
      <List>
        {teachers.map((teacher: UserDto) => (
          <ListItem key={teacher.id}>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={teacher.fullName} />
          </ListItem>
        ))}
      </List>
    </Section>
  );
}

function StudentList({ students }: { students: Array<UserDto> }) {
  return (
    <Section title={<span>Students ({students.length})</span>}>
      {students.length === 0 && (
        <Callout severity="warning">Aucun participant n'a été configuré</Callout>
      )}
      <List>
        {students.map((student: UserDto) => (
          <ListItem key={student.id}>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={student.fullName} />
          </ListItem>
        ))}
      </List>
    </Section>
  );
}

function Formation({ formation }: { formation: PseFormationDto }) {
	const { formatDate } = useI18n()

	return (
    <Section title="Formation">
      <Property name="Status" value={<FormationPseStatusChip state={formation.state} />} />
      <Property name="Date" value={<span>{formatDate(formation.from)} au {formatDate(formation.to)}</span>} />
      <Property name="Lieu" value={<span>{formation.place.title}</span>} />
    </Section>
  );
}

export default function FromationPseRoute() {
  const { formation } = useLoaderData<typeof loader>();

  return (
    <PageContainer>
      <Typography>PSE: {formation.title}</Typography>

      <Grid container spacing={2}>
        <Grid item md={8}>
          <Box mt={2}>
            <Formation formation={formation} />
          </Box>

          <Box mt={2}>
            <StudentList students={formation.students} />
          </Box>
        </Grid>

        <Grid item md={4}>
          <Box mt={2}>
            <TeacherList teachers={formation.teachers} />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
