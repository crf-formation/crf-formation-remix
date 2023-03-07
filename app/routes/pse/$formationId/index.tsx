import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Avatar, Button, Grid, Link, List, ListItem, ListItemAvatar, ListItemText, Stack } from "@mui/material";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationApiObject } from '~/apiobject/pseformation.apiobject';
import FormationPseStatusChip from "~/component/formationpse/FormationPseStatusChip";
import { Ariane, ArianeItem } from '~/component/layout/Ariane';
import PageContainer from "~/component/layout/PageContainer";
import PagePaperHeader from '~/component/layout/PagePaperHeader';
import PageSpace from '~/component/layout/PageSpace';
import PageSubtitle from '~/component/layout/PageSubtitle';
import PageTitle from '~/component/layout/PageTitle';
import Section from "~/component/layout/Section";
import Callout from "~/component/typography/Callout";
import Property from "~/component/typography/Property";
import type { PseFormationDto } from "~/dto/pseformation.dto";
import type { UserDto } from "~/dto/user.dto";
import type { SecurityFunction } from '~/helper/remix';
import { getParamsOrFail } from '~/helper/remix.params.helper';
import useI18n from "~/hook/useI18n";
import useUser from "~/hook/useUser";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { findPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireUser } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string(),
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await requireUser(request)

	const pseFormationApiObject = await findPseFormationById(formationId)
	
	if (!pseFormationApiObject) {
		throw new Error(`Formation not found: ${formationId}`);
	}
	
	await assertUserHasAccessToFormationAsTeacher(userApiObject.id, pseFormationApiObject.id)

  return {
    pseFormationApiObject,
  }
}

// GET a formation
export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject } = await security(request, params)

  return json({
		formation: pseFormationApiObjectToDto(pseFormationApiObject)
	});
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `PSE - ${data?.formation?.title}`,
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
            key={student.id}
            secondaryAction={
              <Link
                href={`/pse/${formationId}/students/${student.id}`}
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
              href={`/pse/${formationId}/students/${student.id}`}
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
    <>
      <PagePaperHeader
        ariane={
          <Ariane>
            <ArianeItem label="PSE" href="pse" />
          </Ariane>
        }
      >
        <PageTitle title={`PSE: ${formation.title}`} />
        <PageSubtitle subtitle={`${formation.place.title}`} />
      </PagePaperHeader>

      <PageSpace variant="header" />

      <PageContainer>
        <Grid container spacing={2}>
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
    </>
  );
}