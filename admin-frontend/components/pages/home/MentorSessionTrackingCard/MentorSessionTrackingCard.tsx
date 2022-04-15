import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  getSession,
  SessionResponse as DjangoSession,
} from "../../../../api/backend/sessions";
import { getSessionGroupsFromViews } from "../../../../api/backend/views/sessionGroups";
import {
  getSessionsFromViews,
  Session as ViewsSession,
} from "../../../../api/backend/views/sessions";
import { Volunteer } from "../../../../api/backend/views/volunteers";
import { PaginatedSelectOption } from "../../../shared/paginatedSelect";
import Header from "./Header";
import SessionTrackingTable from "./SessionTrackingTable";

interface MentorSessionTrackingCardProps {
  mentors: Volunteer[];
}

const ERROR_MESSAGE =
  "Something went wrong! Please contact technical support for further assistance.";

const MentorSessionTrackingCard: React.FunctionComponent<
  MentorSessionTrackingCardProps
> = (props) => {
  const [curMonth, setCurMonth] = useState<number>(new Date().getMonth());
  const [curYear, setCurYear] = useState<number>(new Date().getFullYear());
  const [sessionsForCurMonth, setSessionsForCurMonth] = useState<
    (ViewsSession & DjangoSession)[]
  >([]);
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
  }, [selectedSessionGroupId, curMonth, curYear]);

  const getSessionsForCurMonth = async () => {
    const curMonthStartDate = getCurMonthStartDate();
    const curMonthEndDate = getCurMonthEndDate();
    const viewsSessionRes = await getSessionsFromViews(
      selectedSessionGroupId as string,
      undefined,
      undefined,
      curMonthStartDate,
      curMonthEndDate
    );

    if (
      viewsSessionRes &&
      viewsSessionRes.status === 200 &&
      viewsSessionRes.data
    ) {
      const sessionRes = await getSession();
      if (sessionRes && sessionRes.status === 200 && sessionRes.data) {
        const sessionsInCurMonth = sessionRes.data.filter(
          (session) =>
            session.created_at >= new Date(curMonthStartDate) &&
            session.created_at <= new Date(curMonthEndDate)
        );

        const combinedViewsAndDjangoSessions = sessionsInCurMonth.map(
          (session) => {
            const matchingViewsSession = viewsSessionRes.data.find(
              (viewsSession) =>
                viewsSession.viewsSessionId == session.viewsSessionId
            );
          }
        );
      }
      setSessionsForCurMonth(viewsSessionRes.data);
      setKey(key + 1); // Force re-render of table
    } else {
      toast.error(ERROR_MESSAGE);
    }
  };

  // get current month end date like: '2022-03-01'
  const getCurMonthStartDate = (): string => {
    const firstDayOfMonth = new Date(curYear, curMonth, 1);
    return firstDayOfMonth.toISOString().split("T")[0];
  };

  // get current month end date like: '2022-03-31'
  const getCurMonthEndDate = (): string => {
    const lastDayOfMonth = new Date(curYear, curMonth + 1, 0);
    return lastDayOfMonth.toISOString().split("T")[0];
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

  return (
    <CardLayout>
      <Header
        loadSessionGroupOptions={loadSessionGroupOptions}
        onSessionGroupSelectOptionChange={onSessionGroupSelectOptionChange}
        onSetMonth={setCurMonth}
        curMonth={curMonth}
        onSetYear={setCurYear}
        curYear={curYear}
      ></Header>
      {selectedSessionGroupId !== null && (
        <SessionTrackingTable
          key={`body_${key}`}
          isLoading={isLoading}
          mentors={props.mentors}
          sessionsForMonth={sessionsForCurMonth}
          month={curMonth + 1}
          year={curYear}
        ></SessionTrackingTable>
      )}
    </CardLayout>
  );
};

const CardLayout = styled(Paper)`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 0.1fr 0.9fr;
  grid-template-areas: "Header" "SessionTrackingTable";
  grid-area: "mentorSessionTrackingCard";
  padding: 1rem 2rem 1rem 2rem;
`;

export default MentorSessionTrackingCard;
