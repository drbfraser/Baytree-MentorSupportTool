import { Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getSessionGroupsFromViews } from "../api/backend/views/sessionGroups";
import DataGrid, { SelectOption } from "../components/shared/datagrid";

const MentorRoles: NextPage = () => {
  useEffect(() => {
    loadMentorRoles();
    loadSessionGroupOptions();
    loadActivityOptions();
  }, []);

  const loadMentorRoles = () => {};

  const [sessionGroupOptions, setSessionGroupOptions] = useState<
    SelectOption[]
  >([]);
  const loadSessionGroupOptions = async () => {
    const response = await getSessionGroupsFromViews();
    if (response && response.status === 200 && response.data) {
      console.log(response.data);
      const sessionGroups = response.data;
      setSessionGroupOptions(
        sessionGroups.map((sessionGroup) => ({
          id: parseInt(sessionGroup.viewsSessionGroupId),
          name: sessionGroup.name,
        }))
      );
    } else {
      toast.error("Failed to retrieve session group option data.");
    }
  };

  const [activityOptions, setActivityOptions] = useState<SelectOption[]>([]);
  const loadActivityOptions = () => {
    // if (response && Response.status === 200 && response.data) {
    // } else {
    //   toast.error("Failed to retrieve activity option data.");
    // }
  };

  return (
    <MentorRolesCard>
      <MentorRolesTitle variant="h5">Mentor Roles</MentorRolesTitle>
      <DataGrid
        cols={[
          { header: "Mentor Role", dataField: "mentorRole" },
          {
            header: "Session Group",
            dataField: "sessionGroup",
            selectOptions: sessionGroupOptions,
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
            sessionGroup: 3,
            activity: 1,
          },
        ]}
        onSaveRows={async (dataRows): Promise<void> => {}}
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
