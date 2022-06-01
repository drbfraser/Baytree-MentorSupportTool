import { Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { SessionResponse as DjangoSession } from "../../../../api/backend/sessions";
import { Session as ViewsSession } from "../../../../api/backend/views/sessions";
import {
  BAYTREE_PRIMARY_COLOR,
  MOBILE_BREAKPOINT,
} from "../../../../constants/constants";
import { Mentor } from "../../../../pages/home";
import { MONTH_NAMES } from "../../../../util/misc";
import DataGrid from "../../../shared/datagrid/datagrid";

export interface MentorSessionsModalProps {
  mentor: Mentor;
  mentorSessions: (DjangoSession | (ViewsSession & DjangoSession))[];
  month: number;
  year: number;
}

const MentorSessionsModal: React.FunctionComponent<MentorSessionsModalProps> = (
  props
) => {
  return (
    <MentorSessionsModalLayout>
      <Name>
        <Typography variant="h5">{`${props.mentor.firstName} ${props.mentor.lastName}'s Sessions`}</Typography>
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
            { header: "Date", dataField: "startDate", expandableColumn: true },
            { header: "Activity", dataField: "activity" },
            { header: "Notes", dataField: "notes" },
          ]}
          onLoadDataRows={async () => {
            return props.mentorSessions.map((mentorSession) => {
              // If the Django backend session has a corresponding views session
              const sessionHasAViewsSession = (
                mentorSession: any
              ): mentorSession is ViewsSession & DjangoSession => {
                return mentorSession.leadStaff !== undefined;
              };

              if (sessionHasAViewsSession(mentorSession)) {
                return mentorSession;
              } else {
                return {
                  ...mentorSession,
                  startDate: mentorSession.clock_in,
                  activity: "Mentoring",
                };
              }
            });
          }}
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

const ExpandRowComponentLayout = styled.div`
  width: 100%;
  height: 100%;
`;

const NotesTitle = styled(Typography)``;

const NotesText = styled(Typography)``;

export default MentorSessionsModal;
