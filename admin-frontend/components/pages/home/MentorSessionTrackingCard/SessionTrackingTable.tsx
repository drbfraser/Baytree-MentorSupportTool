import { Skeleton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Session } from "../../../../api/backend/views/sessions";
import { Volunteer } from "../../../../api/backend/views/volunteers";
import { BAYTREE_PRIMARY_COLOR } from "../../../../constants/constants";
import DataGrid from "../../../shared/datagrid";
import Modal from "../../../shared/Modal";
import Pager from "../../../shared/pager";
import MentorSessionsModal from "./MentorSessionsModal";

interface MentorSessionCount {
  id: string;
  firstName: string;
  numSessions: number;
  numSessionsOutOfTotal: string;
}

interface SessionTrackingTableProps {
  sessionsForMonth: Session[];
  mentors: Volunteer[];
  expectedSessionNumberForMonth: number;
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
    useState<Volunteer | null>(null);

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
    mentors: Volunteer[],
    sessionsForMonth: Session[]
  ) => {
    let aggregatedSessionsByMentor: MentorSessionCount[] = [];

    mentors.forEach((mentor, i) =>
      aggregatedSessionsByMentor.push({
        id: mentor.viewsPersonId,
        firstName: mentor.firstname,
        numSessions: 0,
        numSessionsOutOfTotal: "",
      })
    );

    sessionsForMonth.forEach((session) => {
      const sessionStaffId = session.leadStaff;

      const aggregatedMentor = aggregatedSessionsByMentor.find(
        (mentor) => mentor.id === sessionStaffId
      );

      if (aggregatedMentor) {
        aggregatedMentor.numSessions++;
      }
    });

    // Show mentors with least sessions first
    aggregatedSessionsByMentor.sort((mentor1, mentor2) => {
      return mentor1.numSessions - mentor2.numSessions;
    });

    // Add / total
    aggregatedSessionsByMentor = aggregatedSessionsByMentor.map((mentor) => {
      return {
        ...mentor,
        numSessionsOutOfTotal: `${mentor.numSessions} / ${props.expectedSessionNumberForMonth}`,
      };
    });

    return aggregatedSessionsByMentor;
  };

  const clickableMentorNameText = (dataRow: any) => {
    return (
      <ClickableMentorNameText
        onClick={() => {
          const mentor = props.mentors.find(
            (mentor) => mentor.viewsPersonId === dataRow.id
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
        {dataRow.firstName}
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
              dataField: "firstName",
              componentFunc: clickableMentorNameText,
            },
            {
              header: "Sessions",
              dataField: "numSessionsOutOfTotal",
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
            mentor={mentorSessionsModalMentor as Volunteer}
            mentorSessions={props.sessionsForMonth.filter(
              (session) =>
                session.leadStaff === mentorSessionsModalMentor?.viewsPersonId
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
