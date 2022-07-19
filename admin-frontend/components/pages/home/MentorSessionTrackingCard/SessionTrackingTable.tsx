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
import {
  getMentorSessionCounts,
  MentorSessionCount,
} from "./MentorSessionTrackingCard/Logic";

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

  const PAGE_SIZE = 20;
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
