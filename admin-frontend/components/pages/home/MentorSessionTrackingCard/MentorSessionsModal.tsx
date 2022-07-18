import { Typography } from "@mui/material";
import React, { useState } from "react";
import { MdNote } from "react-icons/md";
import styled from "styled-components";
import { Session as ViewsSession } from "../../../../api/backend/views/sessions";
import {
  BAYTREE_PRIMARY_COLOR,
  MOBILE_BREAKPOINT,
} from "../../../../constants/constants";
import { Mentor } from "../../../../pages/home";
import DataGrid from "../../../shared/datagrid/datagrid";
import Modal from "../../../shared/Modal";
import MentorSessionsNotesModal from "./MentorSessionsNotesModal";

export interface MentorSessionsModalProps {
  mentor: Mentor;
  mentorSessions: ViewsSession[];
  year: number;
}

const MentorSessionsModal: React.FunctionComponent<MentorSessionsModalProps> = (
  props
) => {
  const [openedSession, setOpenedSession] = useState<ViewsSession | null>(null);
  const mentorSessions = props.mentorSessions.map((session) => ({
    ...session,
    startDate: session.startDate.toDateString(),
  }));

  return (
    <MentorSessionsModalLayout>
      <Modal
        isOpen={openedSession !== null}
        onOutsideClick={() => setOpenedSession(null)}
        modalComponent={<MentorSessionsNotesModal session={openedSession!} />}
      />
      <Name>
        <Typography variant="h5">{`${props.mentor.fullName}'s Sessions`}</Typography>
      </Name>
      <Date>
        <Typography variant="h5">{`${props.year}`}</Typography>
      </Date>
      <Email>
        <EmailText href={`mailto:${props.mentor.email}`}>
          {props.mentor.email}
        </EmailText>
      </Email>
      <SessionsGrid>
        <DataGrid
          primaryKeyDataField="viewsPersonId"
          cols={[
            {
              header: "Date",
              dataType: "date",
              dataField: "startDate",
            },
          ]}
          dataRowActions={[
            {
              icon: <MdNote />,
              name: "See Notes",
              actionFunction: (dataRow) => {},
            },
          ]}
          onLoadDataRows={async () => props.mentorSessions}
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
