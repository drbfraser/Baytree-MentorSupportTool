import { Skeleton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Session as ViewsSession } from "../../../../api/backend/views/sessions";
import { SessionResponse as DjangoSession } from "../../../../api/backend/sessions";
import { BAYTREE_PRIMARY_COLOR } from "../../../../constants/constants";
import DataGrid from "../../../shared/datagrid/datagrid";
import Modal from "../../../shared/Modal";
import Pager from "../../../shared/pager";
import MentorSessionsModal from "./MentorSessionsModal";
import { Mentor } from "../../../../pages/home";
import { MdSchedule } from "react-icons/md";

interface MentorSessionCount extends Mentor {
  numSessionsJanuary: number;
  numSessionsFebruary: number;
  numSessionsMarch: number;
  numSessionsApril: number;
  numSessionsMay: number;
  numSessionsJune: number;
  numSessionsJuly: number;
  numSessionsAugust: number;
  numSessionsSeptember: number;
  numSessionsOctober: number;
  numSessionsNovember: number;
  numSessionsDecember: number;
}

interface SessionTrackingTableProps {
  sessionsForCurYear: ViewsSession[];
  mentors: Mentor[];
  isLoading: boolean;
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
      props.sessionsForCurYear
    );

    setMaxPageNum(Math.ceil(mentorSessionCountsRef.current.length / PAGE_SIZE));
    setPageNum(1);
    setPagedMentorSessionCounts(
      mentorSessionCountsRef.current.slice(0, PAGE_SIZE)
    );
  }, [props.mentors, props.sessionsForCurYear]);

  const getMentorSessionCounts = (
    mentors: Mentor[],
    sessionsForYear: ViewsSession[]
  ) => {
    let aggregatedSessionsByMentor: MentorSessionCount[] = [];

    // Initialize the session counts for each mentor to 0 for each month
    mentors.forEach((mentor, i) =>
      aggregatedSessionsByMentor.push({
        id: mentor.id,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        email: mentor.email,
        numSessionsJanuary: 0,
        numSessionsFebruary: 0,
        numSessionsMarch: 0,
        numSessionsApril: 0,
        numSessionsMay: 0,
        numSessionsJune: 0,
        numSessionsJuly: 0,
        numSessionsAugust: 0,
        numSessionsSeptember: 0,
        numSessionsOctober: 0,
        numSessionsNovember: 0,
        numSessionsDecember: 0,
      })
    );

    sessionsForYear.forEach((session) => {
      const sessionMentorId = session.leadStaff;

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
              keepColumnOnMobile: true,
            },
            {
              header: "Email",
              dataField: "email",
            },
            {
              header: "Completed",
              dataField: "numSessionsCompleted",
            },
            {
              header: "Cancelled",
              dataField: "numSessionsCancelled",
            },
            {
              header: "Missed",
              dataField: "numSessionsMissed",
            },
          ]}
          data={pagedMentorSessionCounts}
          dataRowActions={[
            {
              actionFunction: (dataRow) => {
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
              },
              icon: <MdSchedule></MdSchedule>,
              name: "Sessions",
            },
          ]}
          isDataGridDeleteable={false}
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
            mentorSessions={props.sessionsForCurYear.filter(
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
