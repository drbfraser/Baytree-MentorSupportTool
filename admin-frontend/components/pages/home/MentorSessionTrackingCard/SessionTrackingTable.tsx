import { Skeleton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Session as ViewsSession } from "../../../../api/backend/views/sessions";
import { SessionResponse as DjangoSession } from "../../../../api/backend/sessions";
import { BAYTREE_PRIMARY_COLOR } from "../../../../constants/constants";
import DataGrid from "../../../shared/datagrid";
import Modal from "../../../shared/Modal";
import Pager from "../../../shared/pager";
import MentorSessionsModal from "./MentorSessionsModal";
import { Mentor } from "../../../../pages/home";

interface MentorSessionCount extends Mentor {
  numSessionsCompleted: number;
  numSessionsMissed: number;
  numSessionsCancelled: number;
}

interface SessionTrackingTableProps {
  sessionsForMonth: ((ViewsSession & DjangoSession) | DjangoSession)[];
  mentors: Mentor[];
  isLoading: boolean;
  month: number;
  year: number;
}

const SessionTrackingTable: React.FunctionComponent<
  SessionTrackingTableProps
> = (props) => {
  const mentorSessionCountsRef = useRef<MentorSessionCount[]>([]);
  const [pagedMentorSessionCounts, setPagedMentorSessionCounts] = useState<
    MentorSessionCount[]
  >([]);

  const [isMentorSessionsModalOpen, setIsMentorSessionsModalOpen] =
    useState(false);
  const [mentorSessionsModalMentor, setMentorSessionsModalMentor] =
    useState<Mentor | null>(null);

  const PAGE_SIZE = 5;
  const [pageNum, setPageNum] = useState(1);
  const [maxPageNum, setMaxPageNum] = useState(1);

  useEffect(() => {
    mentorSessionCountsRef.current = getMentorSessionCounts(
      props.mentors,
      props.sessionsForMonth
    );

    setMaxPageNum(Math.ceil(mentorSessionCountsRef.current.length / PAGE_SIZE));
    setPageNum(1);
    setPagedMentorSessionCounts(
      mentorSessionCountsRef.current.slice(0, PAGE_SIZE)
    );
  }, [props.mentors, props.sessionsForMonth]);

  const getMentorSessionCounts = (
    mentors: Mentor[],
    sessionsForMonth: ((ViewsSession & DjangoSession) | DjangoSession)[]
  ) => {
    let aggregatedSessionsByMentor: MentorSessionCount[] = [];

    mentors.forEach((mentor, i) =>
      aggregatedSessionsByMentor.push({
        id: mentor.id,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        email: mentor.email,
        numSessionsCompleted: 0,
        numSessionsCancelled: 0,
        numSessionsMissed: 0,
      })
    );

    sessionsForMonth.forEach((session) => {
      const sessionMentorId = session.mentor;

      const aggregatedMentor = aggregatedSessionsByMentor.find(
        (mentor) => mentor.id === sessionMentorId
      );

      if (aggregatedMentor) {
        if (session.cancelled) {
          aggregatedMentor.numSessionsCancelled++;
        } else if (!session.attended_by_mentee || !session.attended_by_mentor) {
          aggregatedMentor.numSessionsMissed++;
        } else {
          aggregatedMentor.numSessionsCompleted++;
        }
      }
    });

    // Show mentors with least completed sessions first
    aggregatedSessionsByMentor.sort((mentor1, mentor2) => {
      return mentor1.numSessionsCompleted - mentor2.numSessionsCompleted;
    });

    // Add / total and get full name
    aggregatedSessionsByMentor = aggregatedSessionsByMentor.map((mentor) => {
      return {
        ...mentor,
        fullName: `${mentor.firstName} ${mentor.lastName}`,
      };
    });

    return aggregatedSessionsByMentor;
  };

  const clickableMentorNameText = (dataRow: any) => {
    return (
      <ClickableMentorNameText
        onClick={() => {
          const mentor = props.mentors.find(
            (mentor) => mentor.id === dataRow.id
          );

          if (mentor) {
            setMentorSessionsModalMentor(mentor);
            setIsMentorSessionsModalOpen(true);
          } else {
            toast.error(
              "Something went wrong! Please contact technical support for further assistance."
            );
          }
        }}
      >
        {dataRow.fullName}
      </ClickableMentorNameText>
    );
  };

  return props.isLoading ? (
    <LoadingSessionTrackingTable></LoadingSessionTrackingTable>
  ) : (
    <>
      <SessionTrackingTableLayout>
        <DataGrid
          cols={[
            {
              header: "Name",
              dataField: "fullName",
              componentFunc: clickableMentorNameText,
            },
            {
              header: "Completed",
              dataField: "numSessionsCompleted",
              dataType: "string",
            },
            {
              header: "Cancelled",
              dataField: "numSessionsCancelled",
              dataType: "string",
            },
            {
              header: "Missed",
              dataField: "numSessionsMissed",
              dataType: "string",
            },
          ]}
          data={pagedMentorSessionCounts}
        ></DataGrid>
        <Pager
          currentPageNumber={pageNum}
          maxPageNumber={maxPageNum}
          onChangePage={(newPage) => {
            const offset = (newPage - 1) * PAGE_SIZE;
            const limit = PAGE_SIZE;
            setPageNum(newPage);
            setPagedMentorSessionCounts(
              mentorSessionCountsRef.current.slice(offset, offset + limit)
            );
          }}
        ></Pager>
      </SessionTrackingTableLayout>
      <Modal
        isOpen={isMentorSessionsModalOpen}
        onOutsideClick={() => setIsMentorSessionsModalOpen(false)}
        modalComponent={
          <MentorSessionsModal
            mentor={mentorSessionsModalMentor as Mentor}
            mentorSessions={props.sessionsForMonth.filter(
              (session) => session.mentor === mentorSessionsModalMentor?.id
            )}
            month={props.month}
            year={props.year}
          ></MentorSessionsModal>
        }
      ></Modal>
    </>
  );
};

const SessionTrackingTableLayout = styled.div`
  grid-area: "SessionTrackingTable";
  margin-top: 1rem;
`;

const LoadingSessionTrackingTable: React.FunctionComponent<{}> = () => {
  return (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  );
};

const ClickableMentorNameText = styled(Typography)`
  color: ${BAYTREE_PRIMARY_COLOR};
  text-decoration: underline;
  :hover {
    cursor: pointer;
  }
`;

export default SessionTrackingTable;
