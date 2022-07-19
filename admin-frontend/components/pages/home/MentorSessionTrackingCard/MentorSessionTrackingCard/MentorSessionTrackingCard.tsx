import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getSessionGroupsFromViews } from "../../../../../api/backend/views/sessionGroups";
import {
  getSessionsFromViews,
  Session as ViewsSession,
} from "../../../../../api/backend/views/sessions";
import { Mentor } from "../../../../../pages/home";
import { PaginatedSelectOption } from "../../../../shared/paginatedSelect";
import Header from "../Header";
import SessionTrackingTable from "../SessionTrackingTable";
import { getCurYearEndDate, getCurYearStartDate } from "./Logic";

interface MentorSessionTrackingCardProps {
  mentors: Mentor[];
  mentorFilter: string;
  setMentorFilter: (newMentorFilter: string) => void;
}

const ERROR_MESSAGE =
  "Something went wrong! Please contact technical support for further assistance.";

const MentorSessionTrackingCard: React.FunctionComponent<
  MentorSessionTrackingCardProps
> = (props) => {
  const [curYear, setCurYear] = useState<number>(new Date().getFullYear());
  const [sessionsForCurYear, setSessionsForCurYear] = useState<ViewsSession[]>(
    []
  );

  const [selectedSessionGroupId, setSelectedSessionGroupId] = useState<
    string | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const getInitialSessionsData = async () => {
      setIsLoading(true);
      await getSessionsForCurMonth();
      setIsLoading(false);
    };

    if (selectedSessionGroupId !== null) {
      getInitialSessionsData();
    }
  }, [selectedSessionGroupId, curYear]);

  const getSessionsForCurMonth = async () => {
    const curYearStartDate = getCurYearStartDate(curYear);
    const curYearEndDate = getCurYearEndDate(curYear);
    const viewsSessionRes = await getSessionsFromViews(
      selectedSessionGroupId as string,
      { startDateFrom: curYearStartDate, startDateTo: curYearEndDate }
    );

    if (viewsSessionRes) {
      const sessionsInCurYear = viewsSessionRes.results.filter(
        (session) =>
          new Date(session.startDate) >= new Date(curYearStartDate) &&
          new Date(session.startDate) <= new Date(curYearEndDate)
      );

      setSessionsForCurYear(sessionsInCurYear);
      setKey(key + 1); // Force re-render of table
    } else {
      toast.error(ERROR_MESSAGE);
    }
  };

  const loadSessionGroupOptions = async (search: any, prevOptions: any) => {
    const SESSION_GROUPS_SELECT_PAGE_SIZE = 20;

    const sessionGroups = await getSessionGroupsFromViews(
      SESSION_GROUPS_SELECT_PAGE_SIZE,
      prevOptions.length
    );

    if (sessionGroups && sessionGroups.data) {
      const selectboxOptions = {
        options: sessionGroups.data.map((sessionGroup) => ({
          value: sessionGroup.viewsSessionGroupId,
          label: sessionGroup.name,
        })),
        hasMore:
          prevOptions.length + SESSION_GROUPS_SELECT_PAGE_SIZE <
          sessionGroups.total,
      };

      return selectboxOptions;
    } else {
      toast.error(ERROR_MESSAGE);
      return { options: [], hasMore: false };
    }
  };

  const onSessionGroupSelectOptionChange = async (newSessionGroup: any) => {
    const selectedSessionGroup =
      newSessionGroup as PaginatedSelectOption<string>;

    setSelectedSessionGroupId(selectedSessionGroup.value);
  };

  const onExportButtonClick = () => {
    const exportedFields = [""];
  };

  return (
    <CardLayout>
      <Header
        loadSessionGroupOptions={loadSessionGroupOptions}
        onSessionGroupSelectOptionChange={onSessionGroupSelectOptionChange}
        onSetYear={setCurYear}
        curYear={curYear}
        onExportButtonClick={onExportButtonClick}
        mentorFilter={props.mentorFilter}
        setMentorFilter={props.setMentorFilter}
      ></Header>
      {selectedSessionGroupId !== null && (
        <SessionTrackingTable
          key={`body_${key}`}
          isLoading={isLoading}
          mentors={props.mentors}
          sessionsForCurYear={sessionsForCurYear}
          year={curYear}
        ></SessionTrackingTable>
      )}
    </CardLayout>
  );
};

const CardLayout = styled(Paper)`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, auto);
  grid-template-areas:
    "Header"
    "SessionTrackingTable";
  grid-area: mentorSessionTrackingCard;
  padding: 1rem 2rem 1rem 2rem;
`;

export default MentorSessionTrackingCard;
