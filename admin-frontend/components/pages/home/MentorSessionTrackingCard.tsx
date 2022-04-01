import { Button, Paper, toolbarClasses, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  getSessionsFromViews,
  Session,
} from "../../../api/backend/views/sessions";
import { Volunteer } from "../../../api/backend/views/volunteers";

interface MentorSessionTrackingCardProps {
  mentors: Volunteer[];
}

const MentorSessionTrackingCard: React.FunctionComponent<
  MentorSessionTrackingCardProps
> = () => {
  const [curMonth, setCurMonth] = useState<number>(new Date().getMonth());
  const [sessionsForCurMonth, setSessionsForCurMonth] = useState<Session[]>([]);
  const [expectedSessionNumbersPerMonth, setExpectedSessionNumbersPerMonth] =
    useState<number[]>([]);

  const ERROR_MESSAGE =
    "Something went wrong! Please contact technical support for further assistance.";

  useEffect(() => {
    const getInitialSessionsData = () => {
      getSessionsForCurMonth();
      getExpectedSessionNumbersPerMonth();
    };

    getInitialSessionsData();
  }, []);

  const getSessionsForCurMonth = async () => {
    const curMonthStartDate = getCurMonthStartDate();
    const curMonthEndDate = getCurMonthEndDate();
    const response = await getSessionsFromViews(
      "3",
      undefined,
      undefined,
      curMonthStartDate,
      curMonthEndDate
    );

    if (response && response.status === 200 && response.data) {
      setSessionsForCurMonth(response.data);
    } else {
      toast.error(ERROR_MESSAGE);
    }
  };

  // get current month end date like: '2022-03-01'
  const getCurMonthStartDate = (): string => {
    const firstDayOfMonth = new Date(new Date().getFullYear(), curMonth, 1);
    return firstDayOfMonth.toISOString().split("T")[0];
  };

  // get current month end date like: '2022-03-31'
  const getCurMonthEndDate = (): string => {
    const lastDayOfMonth = new Date(new Date().getFullYear(), curMonth + 1, 0);
    return lastDayOfMonth.toISOString().split("T")[0];
  };

  const getExpectedSessionNumbersPerMonth = () => {
    setExpectedSessionNumbersPerMonth([3, 1, 2, 4, 3, 1, 3, 6, 8, 3, 5, 6]);
  };

  return (
    <CardLayout>
      <Header></Header>
      <Body></Body>
    </CardLayout>
  );
};

const CardLayout = styled(Paper)`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 0.1fr 0.9fr;
  grid-template-areas: "Header" "Body";
  grid-area: "mentorSessionTrackingCard";
  padding: 1rem 2rem 1rem 2rem;
`;

const Header: React.FunctionComponent<{}> = () => {
  return (
    <HeaderLayout>
      <HeaderTitle></HeaderTitle>
      <MoreButton></MoreButton>
    </HeaderLayout>
  );
};

const HeaderLayout = styled.div`
  display: flex;
  justify-content: space-between;
  grid-area: "Header";
`;

const HeaderTitle: React.FunctionComponent<{}> = () => {
  return <Typography variant="h5">Sessions</Typography>;
};

const MoreButton: React.FunctionComponent<{}> = () => {
  return (
    <Button variant="outlined" color="success">
      More
    </Button>
  );
};

const Body: React.FunctionComponent<{}> = () => {
  return <BodyLayout></BodyLayout>;
};

const BodyLayout = styled.div`
  grid-area: "Body";
`;

export default MentorSessionTrackingCard;
