import { Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import styled from "styled-components";
import DataGrid from "../components/shared/datagrid";

const MentorRoles: NextPage = () => {
  return (
    <MentorRolesCard>
      <MentorRolesTitle variant="h5">Mentor Roles</MentorRolesTitle>
      <DataGrid
        cols={[
          { header: "Mentor Role", dataField: "mentorRole" },
          {
            header: "Session Group",
            dataField: "sessionGroup",
            selectOptions: [{ name: "YS 2021", id: 1 }],
            onSelectOptionChanged: (newOption) => {},
          },
          {
            header: "Activity",
            dataField: "activity",
            selectOptions: [
              { name: "Youth mentoring", id: 1 },
              { name: "Into School mentoring", id: 2 },
            ],
            onSelectOptionChanged: (newOption) => {},
          },
        ]}
        data={[
          {
            mentorRole: "Youth Mentor",
            sessionGroup: 1,
            activity: 1,
          },
        ]}
        onSaveRows={(dataRows) => {
          const promise = new Promise<void>((resolve, reject) => {
            console.log(dataRows);
            setTimeout(() => {
              console.log(dataRows);
              resolve();
            }, 2000);
          });

          return promise;
        }}
      ></DataGrid>
    </MentorRolesCard>
  );
};

const MentorRolesCard = styled(Paper)`
  padding: 2rem;
`;

const MentorRolesTitle = styled(Typography)`
  margin-bottom: 1rem;
`;

export default MentorRoles;
