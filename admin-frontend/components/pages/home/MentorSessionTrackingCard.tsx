import { Button, Paper, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Legend,
} from "recharts";
import styled from "styled-components";
import {
  getSessionsFromViews,
  Session,
} from "../../../api/backend/views/sessions";
import { Volunteer } from "../../../api/backend/views/volunteers";
import { COLORS } from "../../../constants/constants";

interface MentorSessionTrackingCardProps {
  mentors: Volunteer[];
}

const MentorSessionTrackingCard: React.FunctionComponent<
  MentorSessionTrackingCardProps
> = (props) => {
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
      <Body
        mentors={props.mentors}
        expectedSessionNumberForMonth={expectedSessionNumbersPerMonth[curMonth]}
        sessionsForMonth={sessionsForCurMonth}
      ></Body>
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

interface BodyProps {
  sessionsForMonth: Session[];
  mentors: Volunteer[];
  expectedSessionNumberForMonth: number;
}

interface BottomMentor {
  id: string;
  firstName: string;
  numSessions: number;
}

const getUniqueColor = (n: number) => {
  return COLORS[n % COLORS.length];
};

const Body: React.FunctionComponent<BodyProps> = (props) => {
  const [bottomTenMentors, setBottomTenMentors] = useState<BottomMentor[]>([]);

  useEffect(() => {
    const bottomTenMentors = getBottomTenMentors(
      props.mentors,
      props.sessionsForMonth
    );

    setBottomTenMentors(bottomTenMentors);
  }, [props.mentors]);

  const getBottomTenMentors = (
    mentors: Volunteer[],
    sessionsForMonth: Session[]
  ) => {
    const aggregatedSessionsByMentor: BottomMentor[] = [];

    for (const session of sessionsForMonth) {
      const sessionStaffId = session.leadStaff;

      const aggregatedMentor = aggregatedSessionsByMentor.find(
        (mentor) => mentor.id === sessionStaffId
      );

      if (aggregatedMentor) {
        aggregatedMentor.numSessions++;
      } else {
        // Find mentor with same id to get their first name
        const mentor = mentors.filter(
          (mentor) => mentor.viewsPersonId === sessionStaffId
        )[0];

        aggregatedSessionsByMentor.push({
          id: sessionStaffId,
          firstName: mentor.firstname,
          numSessions: 1,
        });
      }
    }

    aggregatedSessionsByMentor.sort((mentor1, mentor2) => {
      return mentor1.numSessions - mentor2.numSessions;
    });

    return aggregatedSessionsByMentor.slice(0, 10);
  };

  return bottomTenMentors.length === 0 ? (
    <LoadingBody></LoadingBody>
  ) : (
    <BodyLayout>
      <StyledChart>
        <ResponsiveContainer width="99%" height={240}>
          <BarChart data={bottomTenMentors}>
            <CartesianGrid></CartesianGrid>
            <Bar
              key={`bar_num_sessions`}
              dataKey={"numSessions"}
              name={"firstName"}
              fill={"red"}
            >
              {bottomTenMentors.map((bottomMentor, i) => (
                <Cell key={`cell-${i}`} fill={getUniqueColor(i)} />
              ))}
            </Bar>
            <XAxis dataKey={"firstName"}></XAxis>
            <YAxis />
          </BarChart>
        </ResponsiveContainer>
      </StyledChart>
      <CustomLegend bottomMentors={bottomTenMentors}></CustomLegend>
    </BodyLayout>
  );
};

const BodyLayout = styled.div`
  grid-area: "Body";
  margin-top: 1rem;
  margin-left: -2rem; /* For aligning the chart in the middle of card */
`;

const StyledChart = styled.div`
  grid-area: chart;
`;

const LoadingBody: React.FunctionComponent<{}> = () => {
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

interface CustomLegendProps {
  bottomMentors: BottomMentor[];
}

const CustomLegend: React.FunctionComponent<CustomLegendProps> = (props) => {
  return (
    <CustomLegendLayout>
      {props.bottomMentors.map((bottomMentor, i) => (
        <LegendItem
          color={getUniqueColor(i)}
          title={bottomMentor.firstName}
        ></LegendItem>
      ))}
    </CustomLegendLayout>
  );
};

const CustomLegendLayout = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
`;

interface LegendItemProps {
  color: string;
  title: string;
}

const LegendItem: React.FunctionComponent<LegendItemProps> = (props) => {
  return (
    <LegendItemLayout>
      <ColorBlock color={props.color}></ColorBlock>
      <Title>{props.title}</Title>
    </LegendItemLayout>
  );
};

const LegendItemLayout = styled.div`
  display: flex;
  align-items: center;
`;

interface ColorBlockProps {
  color: string;
}

const ColorBlock = styled.div<ColorBlockProps>`
  width: 1rem;
  height: 1rem;
  background-color: ${(props) => props.color};
  margin-right: 0.5rem;
`;

const Title = styled(Typography)`
  margin-right: 0.5rem;
`;

export default MentorSessionTrackingCard;
