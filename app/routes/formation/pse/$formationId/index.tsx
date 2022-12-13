import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Avatar, Button, Grid, Link, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import FormationPseStatusChip from "~/components/formationpse/FormationPseStatusChip";
import PageContainer from "~/components/layout/PageContainer";
import Section from "~/components/layout/Section";
import Callout from "~/components/typography/Callout";
import Property from "~/components/typography/Property";
import type { PseFormationDto } from "~/dto/pseformation.dto";
import type { UserDto } from "~/dto/user.dto";
import useI18n from "~/hooks/useI18n";
import useUser from "~/hooks/useUser";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { findPseFormationById } from "~/services/pseformation.server";
import { assertUserHasAccessToFormation } from "~/services/security.server";
import { requireUser } from "~/services/session.server";
import { getParamsOrFail } from '~/utils/remix.params';

const ParamsSchema = z.object({
  formationId: z.string(),
});

// GET a formation
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	const { formationId } = getParamsOrFail(params, ParamsSchema)

	const user = await requireUser(request)

	const pseFormationApiObject = await findPseFormationById(formationId)
	
	if (!pseFormationApiObject) {
		throw new Error(`Formation not found: ${formationId}`);
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

function TeacherList({ teachers, formationId, hasAdminPermission }: { teachers: Array<UserDto>, formationId: string, hasAdminPermission: boolean }) {
  return (
    <Section
      title={<span>Formateurs ({teachers.length})</span>}
      action={
        hasAdminPermission && (
          <span>
            <Link href={`/admin/pse/${formationId}/teachers`}><PersonAddIcon /></Link>
          </span>
        )
      }
    >
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

function StudentList({ students, formationId, hasAdminPermission }: { students: Array<UserDto>, formationId: string, hasAdminPermission: boolean }) {
  return (
    <Section
      title={<span>Participants ({students.length})</span>}
      action={
        hasAdminPermission && (
          <span>
            <Link href={`/admin/pse/${formationId}/students`}>
              <PersonAddIcon />
            </Link>
          </span>
        )
      }
    >
      {students.length === 0 && (
        <Callout severity="warning">
          Aucun participant n'a été configuré
        </Callout>
      )}
      <List>
        {students.map((student: UserDto) => (
          <ListItem
            secondaryAction={
              <Link
                href={`/formation/pse/${formationId}/students/${student.id}`}
              >
                <Button>Suivi individuel</Button>
              </Link>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <Link
              key={student.id}
              href={`/formation/pse/${formationId}/students/${student.id}`}
            >
              <ListItemText primary={student.fullName} />
            </Link>
          </ListItem>
        ))}
      </List>
    </Section>
  );
}

function Formation({ formation, hasAdminPermission }: { formation: PseFormationDto, hasAdminPermission: boolean}) {
	const { formatDate } = useI18n()

	return (
    <Section 
      title="Formation"
      action={
        hasAdminPermission && (
          <span>
            <Link href={`/admin/pse/${formation.id}/summary`}><EditIcon /></Link>
          </span>
        )
      }
    >
      <Property name="Status" value={<FormationPseStatusChip state={formation.state} />} />
      <Property name="Date" value={<span>{formatDate(formation.from)} au {formatDate(formation.to)}</span>} />
      <Property name="Lieu" value={<span>{formation.place.title}</span>} />
    </Section>
  );
}

export default function FromationPseRoute() {
  const { formation } = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <PageContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">PSE: {formation.title}</Typography>
        </Grid>

        <Grid item md={8}>
          <Stack spacing={2}>
            <Formation
              formation={formation}
              hasAdminPermission={user.hasAdminPermission}
            />
            <StudentList
              formationId={formation.id}
              students={formation.students}
              hasAdminPermission={user.hasAdminPermission}
            />
          </Stack>
        </Grid>

        <Grid item md={4}>
          <Stack spacing={2}>
            <TeacherList
              formationId={formation.id}
              teachers={formation.teachers}
              hasAdminPermission={user.hasAdminPermission}
            />
          </Stack>
        </Grid>
      </Grid>
    </PageContainer>
  );
}