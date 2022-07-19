import { Skeleton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Session as ViewsSession } from "../../../../api/backend/views/sessions";
import { BAYTREE_PRIMARY_COLOR } from "../../../../constants/constants";
import DataGrid from "../../../shared/datagrid/datagrid";
import Modal from "../../../shared/Modal";
import Pager from "../../../shared/pager";
import MentorSessionsModal from "./MentorSessionsModal";
import { Mentor } from "../../../../pages/home";
import { MdSchedule } from "react-icons/md";

interface MentorSessionCount extends Mentor {
  januarySessions: number;
  februarySessions: number;
  marchSessions: number;
  aprilSessions: number;
  maySessions: number;
  juneSessions: number;
  julySessions: number;
  augustSessions: number;
  septemberSessions: number;
  octoberSessions: number;
  novemberSessions: number;
  decemberSessions: number;
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
        viewsPersonId: mentor.viewsPersonId,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        email: mentor.email,
        fullName: mentor.fullName,
        januarySessions: 0,
        februarySessions: 0,
        marchSessions: 0,
        aprilSessions: 0,
        maySessions: 0,
        juneSessions: 0,
        julySessions: 0,
        augustSessions: 0,
        septemberSessions: 0,
        octoberSessions: 0,
        novemberSessions: 0,
        decemberSessions: 0,
      })
    );

    sessionsForYear.forEach((session) => {
      const sessionLeadStaffId = session.leadStaff;

      const aggregatedMentor = aggregatedSessionsByMentor.find(
        (mentor) => mentor.viewsPersonId === sessionLeadStaffId
      );

      if (aggregatedMentor && !session.cancelled) {
        const sessionMonthNum = session.startDate.getMonth();
        switch (sessionMonthNum) {
          case 0:
            aggregatedMentor.januarySessions++;
            break;
          case 1:
            aggregatedMentor.februarySessions++;
            break;
          case 2:
            aggregatedMentor.marchSessions++;
            break;
          case 3:
            aggregatedMentor.aprilSessions++;
            break;
          case 4:
            aggregatedMentor.maySessions++;
            break;
          case 5:
            aggregatedMentor.juneSessions++;
            break;
          case 6:
            aggregatedMentor.julySessions++;
            break;
          case 7:
            aggregatedMentor.augustSessions++;
            break;
          case 8:
            aggregatedMentor.septemberSessions++;
            break;
          case 9:
            aggregatedMentor.octoberSessions++;
            break;
          case 10:
            aggregatedMentor.novemberSessions++;
            break;
          case 11:
            aggregatedMentor.decemberSessions++;
            break;
        }
      }
    });

    // Show mentors in alphabetical order by name
    aggregatedSessionsByMentor.sort((mentor1, mentor2) => {
      return mentor1.fullName.localeCompare(mentor2.fullName);
    });

    return aggregatedSessionsByMentor;
  };

  const clickableMentorNameText = (dataRow: any) => {
    return (
      <ClickableMentorNameText
        onClick={() => {
          const mentor = props.mentors.find(
            (mentor) => mentor.viewsPersonId === dataRow.viewsPersonId
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
              header: "Sep",
              dataField: "septemberSessions",
            },
            {
              header: "Oct",
              dataField: "octoberSessions",
            },
            {
              header: "Nov",
              dataField: "novemberSessions",
            },
            {
              header: "Dec",
              dataField: "decemberSessions",
            },
            {
              header: "Jan",
              dataField: "januarySessions",
            },
            {
              header: "Feb",
              dataField: "februarySessions",
            },
            {
              header: "Mar",
              dataField: "marchSessions",
            },
            {
              header: "Apr",
              dataField: "aprilSessions",
            },
            {
              header: "May",
              dataField: "maySessions",
            },
            {
              header: "Jun",
              dataField: "juneSessions",
            },
            {
              header: "Jul",
              dataField: "julySessions",
            },
            {
              header: "Aug",
              dataField: "augustSessions",
            },
          ]}
          primaryKeyDataField="viewsPersonId"
          data={pagedMentorSessionCounts}
          dataRowActions={[
            {
              actionFunction: (dataRow) => {
                const mentor = props.mentors.find(
                  (mentor) => mentor.viewsPersonId === dataRow.viewsPersonId
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
              (session) =>
                session.leadStaff === mentorSessionsModalMentor?.viewsPersonId
            )}
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
