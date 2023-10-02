import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import type { LoaderArgs , V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import FormationPseStatusChip from "~/component/formationpse/FormationPseStatusChip";
import { Ariane, ArianeItem } from "~/component/layout/Ariane";
import Page from "~/component/layout/Page";
import Section from "~/component/layout/Section";
import Callout from "~/component/typography/Callout";
import Property from "~/component/typography/Property";
import type { PseFormationDto } from "~/dto/pseformation.dto";
import type { UserDto } from "~/dto/user.dto";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import useI18n from "~/hook/useI18n";
import useSecurity from "~/hook/useSecurity";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { findPseFormationById } from "~/service/pseformation.server";
import { assertUserHasAccessToFormationAsTeacher } from "~/service/security.server";
import { requireLoggedInRequestContext } from "~/service/session.server";

const ParamsSchema = z.object({
  formationId: z.string()
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { userMeApiObject } = await requireLoggedInRequestContext(request);

  const { formationId } = getParamsOrFail(params, ParamsSchema);
  const pseFormationApiObject = await findPseFormationById(formationId);

  if (!pseFormationApiObject) {
    throw new Error(`Formation not found: ${formationId}`);
  }

  await assertUserHasAccessToFormationAsTeacher(userMeApiObject.id, pseFormationApiObject.id);

  return {
    pseFormationApiObject
  };
};

// GET a formation
export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject } = await security(request, params);

  return json({
    formation: pseFormationApiObjectToDto(pseFormationApiObject)
  });
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `PSE - ${data?.formation?.title}` }
  ];
};

function TeacherList({ teachers, formationId, hasAdminPermission }: {
  teachers: Array<UserDto>,
  formationId: string,
  hasAdminPermission: boolean
}) {
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

function StudentList({ students, formationId, hasAdminPermission }: {
  students: Array<UserDto>,
  formationId: string,
  hasAdminPermission: boolean
}) {
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

function Formation({ formation, hasAdminPermission }: { formation: PseFormationDto, hasAdminPermission: boolean }) {
  const { formatDate } = useI18n();

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
      <Property name="Date"
                value={<span>{formatDate(formation.from, "date")} au {formatDate(formation.to, "date")}</span>} />
      <Property name="Lieu" value={<span>{formation.place.title}</span>} />
    </Section>
  );
}

export default function FromationPseRoute() {
  const { formation } = useLoaderData<typeof loader>();
  const { hasAuthority } = useSecurity();

  const hasAdminPermission = hasAuthority('admin');

  return (
    <Page
      ariane={
        <Ariane>
          <ArianeItem label="PSE" href="pse" />
        </Ariane>
      }
      title={`PSE: ${formation.title}`}
      subtitle={`${formation.place.title}`}
    >

      <Grid container spacing={2}>
        <Grid item md={8}>
          <Stack spacing={2}>
            <Formation
              formation={formation}
              hasAdminPermission={hasAdminPermission}
            />
            <StudentList
              formationId={formation.id}
              students={formation.students}
              hasAdminPermission={hasAdminPermission}
            />
          </Stack>
        </Grid>

        <Grid item md={4}>
          <Stack spacing={2}>
            <TeacherList
              formationId={formation.id}
              teachers={formation.teachers}
              hasAdminPermission={hasAdminPermission}
            />
          </Stack>
        </Grid>
      </Grid>

    </Page>
  );
}