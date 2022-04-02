import { Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { Session } from "../../../../api/backend/views/sessions";
import { Volunteer } from "../../../../api/backend/views/volunteers";
import {
  BAYTREE_PRIMARY_COLOR,
  MOBILE_BREAKPOINT,
} from "../../../../constants/constants";
import { MONTH_NAMES } from "../../../../util/misc";
import DataGrid from "../../../shared/datagrid";

export interface MentorSessionsModalProps {
  mentor: Volunteer;
  mentorSessions: Session[];
  month: number;
  year: number;
}

const MentorSessionsModal: React.FunctionComponent<MentorSessionsModalProps> = (
  props
) => {
  return (
    <MentorSessionsModalLayout>
      <Name>
        <Typography variant="h5">{`${props.mentor.firstname} ${props.mentor.surname}'s Sessions`}</Typography>
      </Name>
      <Date>
        <Typography variant="h5">{`${props.year} / ${
          MONTH_NAMES[props.month - 1]
        }`}</Typography>
      </Date>
      <Email>
        <EmailText href={`mailto:${props.mentor.email}`}>
          {props.mentor.email}
        </EmailText>
      </Email>
      <SessionsGrid>
        <DataGrid
          cols={[
            { header: "Date", dataField: "startDate", dataType: "date" },
            { header: "Activity", dataField: "activity", dataType: "string" },
          ]}
          data={props.mentorSessions}
        ></DataGrid>
      </SessionsGrid>
    </MentorSessionsModalLayout>
  );
};

const MentorSessionsModalLayout = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-template-rows: auto auto;
  grid-row-gap: 1rem;
  grid-template-areas:
    "name date email"
    "sessionsGrid sessionsGrid sessionsGrid";
  grid-column-gap: 2rem;

  align-items: center;

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      "name"
      "date"
      "email"
      "sessionsGrid";
  }
`;

const SessionsGrid = styled.div`
  grid-area: sessionsGrid;
`;

const Name = styled.div`
  grid-area: name;
`;

const Date = styled.div`
  grid-area: date;
`;

const Email = styled.div`
  grid-area: email;
`;

const EmailText = styled.a`
  color: ${BAYTREE_PRIMARY_COLOR};
  text-decoration: underline;
`;

export default MentorSessionsModal;
