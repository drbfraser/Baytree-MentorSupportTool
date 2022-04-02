import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  addMonthlyExpectedSessionCount,
  getMonthlyExpectedSessionCount,
  MonthlyExpectedSessionCountCreate,
  MonthlyExpectedSessionCountUpdate,
  updateMonthlyExpectedSessionCount,
} from "../../../../api/backend/monthlyExpectedSessionCounts";
import { getSessionGroupsFromViews } from "../../../../api/backend/views/sessionGroups";
import {
  getSessionsFromViews,
  Session,
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
  const [sessionsForCurMonth, setSessionsForCurMonth] = useState<Session[]>([]);
  const [expectedSessionNumbersPerMonth, setExpectedSessionNumbersPerMonth] =
    useState<number[]>([]);
  const [selectedSessionGroupId, setSelectedSessionGroupId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const getInitialSessionsData = async () => {
      setIsLoading(true);
      await getSessionsForCurMonth();
      await getExpectedSessionNumbersPerMonth();
      setIsLoading(false);
    };

    if (selectedSessionGroupId !== null) {
      getInitialSessionsData();
    }
  }, [selectedSessionGroupId, curMonth, curYear]);

  const getSessionsForCurMonth = async () => {
    const curMonthStartDate = getCurMonthStartDate();
    const curMonthEndDate = getCurMonthEndDate();
    const response = await getSessionsFromViews(
      selectedSessionGroupId as string,
      undefined,
      undefined,
      curMonthStartDate,
      curMonthEndDate
    );

    if (response && response.status === 200 && response.data) {
      setSessionsForCurMonth(response.data);
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

  const getExpectedSessionNumbersPerMonth = async () => {
    const apiRes = await getMonthlyExpectedSessionCount(undefined, undefined, {
      id: curYear.toString(),
    });

    if (
      apiRes &&
      apiRes.status === 200 &&
      apiRes.data &&
      apiRes.data.length > 0
    ) {
      let expectedSessionsPerMonth: number[] = [];
      const expectedSessionsPerMonthRes = apiRes.data[0];
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.january_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.february_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.march_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.april_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.may_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.june_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.july_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.august_count);
      expectedSessionsPerMonth.push(
        expectedSessionsPerMonthRes.september_count
      );
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.october_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.november_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.december_count);

      setExpectedSessionNumbersPerMonth(expectedSessionsPerMonth);
    } else {
      setExpectedSessionNumbersPerMonth([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
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

  const saveExpectedMonthCounts = async (year: number, newCounts: number[]) => {
    const newMonthlySessionCounts: MonthlyExpectedSessionCountUpdate = {
      year: year,
      id: year,
      january_count: newCounts[0],
      february_count: newCounts[1],
      march_count: newCounts[2],
      april_count: newCounts[3],
      may_count: newCounts[4],
      june_count: newCounts[5],
      july_count: newCounts[6],
      august_count: newCounts[7],
      september_count: newCounts[8],
      october_count: newCounts[9],
      november_count: newCounts[10],
      december_count: newCounts[11],
    };

    let apiRes = await updateMonthlyExpectedSessionCount(
      newMonthlySessionCounts
    );

    const SUCCESS_MESSAGE = "Successfully saved monthly session counts!";
    const ERROR_MESSAGE = "Failed to save monthly session counts.";
    // There is no existing entry, so create a year
    if (apiRes !== null && apiRes.status === 404) {
      apiRes = await addMonthlyExpectedSessionCount(newMonthlySessionCounts);
      if (apiRes && apiRes.status === 200) {
        toast.success(SUCCESS_MESSAGE);
      } else {
        toast.error(ERROR_MESSAGE);
      }
    } else if (apiRes && apiRes.status === 200) {
      toast.success(SUCCESS_MESSAGE);
    } else {
      toast.error("Failed to save. Are all months correct whole numbers?");
      throw new Error("Failed to save.");
    }
  };

  return (
    <CardLayout>
      <Header
        saveExpectedMonthCounts={saveExpectedMonthCounts}
        loadSessionGroupOptions={loadSessionGroupOptions}
        onSessionGroupSelectOptionChange={onSessionGroupSelectOptionChange}
        onSetMonth={setCurMonth}
        curMonth={curMonth}
        onSetYear={setCurYear}
        curYear={curYear}
        expectedMonthCounts={expectedSessionNumbersPerMonth}
        setExpectedMonthCounts={setExpectedSessionNumbersPerMonth}
      ></Header>
      {selectedSessionGroupId !== null && (
        <SessionTrackingTable
          key={`body_${key}`}
          isLoading={isLoading}
          mentors={props.mentors}
          expectedSessionNumberForMonth={
            expectedSessionNumbersPerMonth[curMonth]
          }
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
