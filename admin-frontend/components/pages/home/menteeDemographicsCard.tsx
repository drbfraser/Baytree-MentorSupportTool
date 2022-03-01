import Paper from "@mui/material/Paper";
import styled from "styled-components";
import {
  COLORS,
  HELP_MESSAGE,
  MOBILE_BREAKPOINT,
} from "../../../constants/constants";

import React, { PureComponent, useEffect, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import { Button, ButtonGroup, Skeleton, Typography } from "@mui/material";
import moment from "moment";
import { toast } from "react-toastify";
import { stringify } from "querystring";
import {
  getParticipantsFromViews,
  Participant,
} from "../../../api/backend/views/participants";
interface MenteeDemographicsData {
  age: {
    age8To9: number;
    age10To12: number;
    age13To20: number;
    age20Plus: number;
    notEntered: number;
  };
  ethnicity: Record<string, number>;
  birthLocation: Record<string, number>;
}

type DemographicCategory = "age" | "ethnicity" | "birthLocation";

const MenteeDemographicsCard: React.FC<{}> = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState<MenteeDemographicsData | null>(null);
  const [selectedDemographicCategory, setSelectedDemographicCategory] =
    useState<DemographicCategory>("age");

  const getAgeInYearsFromBirthDate = (birthDate: Date | null) => {
    return moment().diff(birthDate, "years");
  };

  const getParticipantsInAgeRange = (
    participants: Participant[],
    minAge: number,
    maxAge?: number
  ) => {
    return participants.filter((participant) => {
      const participantAgeInYears = getAgeInYearsFromBirthDate(
        participant.dateOfBirth
      );
      return (
        participantAgeInYears >= minAge &&
        (!maxAge || participantAgeInYears <= maxAge)
      );
    });
  };

  const getParticipantsAgeNotEntered = (participants: Participant[]) => {
    return participants.filter((participant) => {
      return !participant.dateOfBirth;
    });
  };

  const getParticipantEthnicityCounts = (participants: Participant[]) => {
    let ethnicityCounts: Record<string, number> = {};
    for (const participant of participants) {
      const ethnicity = participant.ethnicity ?? "Not Entered";
      if (ethnicity in ethnicityCounts) {
        ethnicityCounts[ethnicity] += 1;
      } else {
        ethnicityCounts[ethnicity] = 1;
      }
    }

    return ethnicityCounts;
  };

  const getParticipantBirthCountryCounts = (participants: Participant[]) => {
    let birthCountryCounts: Record<string, number> = {};
    for (const participant of participants) {
      const birthCountry = participant.country ?? "Not Entered";
      if (birthCountry in birthCountryCounts) {
        birthCountryCounts[birthCountry] += 1;
      } else {
        birthCountryCounts[birthCountry] = 1;
      }
    }

    return birthCountryCounts;
  };

  useEffect(() => {
    async function getMenteeDemographicsData() {
      setLoadingData(true);
      const participants = await getParticipantsFromViews();
      if (participants && participants.data) {
        const menteeDemographicsData: MenteeDemographicsData = {
          age: {
            age8To9: getParticipantsInAgeRange(participants.data, 8, 9).length,
            age10To12: getParticipantsInAgeRange(participants.data, 10, 12)
              .length,
            age13To20: getParticipantsInAgeRange(participants.data, 13, 20)
              .length,
            age20Plus: getParticipantsInAgeRange(participants.data, 20).length,
            notEntered: getParticipantsAgeNotEntered(participants.data).length,
          },
          ethnicity: getParticipantEthnicityCounts(participants.data),
          birthLocation: getParticipantBirthCountryCounts(participants.data),
        };

        setData(menteeDemographicsData);
      } else {
        toast.error(HELP_MESSAGE);
      }

      setLoadingData(false);
    }

    getMenteeDemographicsData();
  }, []);

  return (
    <StyledMenteeDemographicsCard>
      {loadingData ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <>
          <Header
            selectedDemographicCategory={selectedDemographicCategory}
            setSelectedDemographicCategory={setSelectedDemographicCategory}
          ></Header>
          <Chart
            selectedDemographicCategory={selectedDemographicCategory}
            data={data}
          ></Chart>
          <Legend
            selectedCategory={selectedDemographicCategory}
            data={data}
          ></Legend>
        </>
      )}
    </StyledMenteeDemographicsCard>
  );
};

const StyledMenteeDemographicsCard = styled(Paper)`
  width: 100%;
  height: 100%;
  padding: 1rem 2rem 1rem 2rem;
  display: grid;
  grid-area: menteeDemographicsCard;
  grid-template-columns: 1.5fr 1fr;
  grid-template-rows: 1fr 3fr;
  grid-template-areas:
    "header header"
    "chart legend";
`;

const Header: React.FC<{
  selectedDemographicCategory: DemographicCategory;
  setSelectedDemographicCategory: React.Dispatch<
    React.SetStateAction<DemographicCategory>
  >;
}> = (props) => {
  return (
    <StyledHeader>
      <Title></Title>
      <MoreInfoButton></MoreInfoButton>
      <Options
        selectedDemographicCategory={props.selectedDemographicCategory}
        setSelectedDemographicCategory={props.setSelectedDemographicCategory}
      ></Options>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-area: header;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "title moreInfo"
    "options options";
`;

const Title: React.FC<{}> = () => {
  return (
    <StyledTitle>
      <Typography variant="h5">Mentee Demographics</Typography>
    </StyledTitle>
  );
};

const StyledTitle = styled.div`
  grid-area: title;
`;

const MoreInfoButton: React.FC<{}> = () => {
  return (
    <StyledMoreInfoButton>
      <StyledMoreInfoText variant="button">See More Info</StyledMoreInfoText>
    </StyledMoreInfoButton>
  );
};

const StyledMoreInfoButton = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-area: moreInfo;
`;

const StyledMoreInfoText = styled(Typography)`
  text-decoration: underline;
  :hover {
    cursor: pointer;
  }
`;

const Options: React.FC<{
  selectedDemographicCategory: DemographicCategory;
  setSelectedDemographicCategory: React.Dispatch<
    React.SetStateAction<DemographicCategory>
  >;
}> = (props) => {
  return (
    <StyledOptions>
      <ButtonGroup variant="outlined" color="success">
        <Button
          variant={
            props.selectedDemographicCategory === "age"
              ? "contained"
              : "outlined"
          }
          onClick={() => {
            props.setSelectedDemographicCategory("age");
          }}
        >
          Age
        </Button>
        <Button
          variant={
            props.selectedDemographicCategory === "ethnicity"
              ? "contained"
              : "outlined"
          }
          onClick={() => {
            props.setSelectedDemographicCategory("ethnicity");
          }}
        >
          Ethnicity
        </Button>
        <Button
          variant={
            props.selectedDemographicCategory === "birthLocation"
              ? "contained"
              : "outlined"
          }
          onClick={() => {
            props.setSelectedDemographicCategory("birthLocation");
          }}
        >
          Birth Location
        </Button>
      </ButtonGroup>
    </StyledOptions>
  );
};

const StyledOptions = styled.div`
  grid-area: options;
`;

const Chart: React.FC<{
  data: MenteeDemographicsData | null;
  selectedDemographicCategory: DemographicCategory;
}> = (props) => {
  // Pie Chart Example: https://recharts.org/en-US/examples/PieChartWithCustomizedLabel

  const convertDemographicDataToPieChartData = (
    demographicData: MenteeDemographicsData | null,
    selectedDemographicCategory: DemographicCategory
  ) => {
    if (demographicData === null) {
      return [];
    }

    switch (selectedDemographicCategory) {
      case "age":
        return [
          { name: "Age8To9", value: demographicData.age.age8To9 },
          { name: "Age10To12", value: demographicData.age.age10To12 },
          { name: "Age13To20", value: demographicData.age.age13To20 },
          { name: "Age20Plus", value: demographicData.age.age20Plus },
          { name: "AgeNotEntered", value: demographicData.age.notEntered },
        ];
      case "birthLocation":
        let birthLocationData: { name: string; value: number }[] = [];

        for (const birthLocation in demographicData.birthLocation) {
          birthLocationData.push({
            name: birthLocation,
            value: demographicData.birthLocation[birthLocation],
          });
        }
        return birthLocationData;
      case "ethnicity":
        let ethnicityData: { name: string; value: number }[] = [];

        for (const ethnicity in demographicData.ethnicity) {
          ethnicityData.push({
            name: ethnicity,
            value: demographicData.ethnicity[ethnicity],
          });
        }
        return ethnicityData;
    }
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <StyledChart>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={convertDemographicDataToPieChartData(
              props.data,
              props.selectedDemographicCategory
            )}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {convertDemographicDataToPieChartData(
              props.data,
              props.selectedDemographicCategory
            ).map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </StyledChart>
  );
};

const StyledChart = styled.div`
  grid-area: chart;
`;

interface LegendEntry {
  title: string;
  color: string;
}

const Legend: React.FC<{
  selectedCategory: DemographicCategory;
  data: MenteeDemographicsData | null;
}> = (props) => {
  const getUniqueColor = (n: number) => {
    return COLORS[n % COLORS.length];
  };

  return (
    <StyledLegend>
      {props.data && props.selectedCategory === "age" && (
        <>
          <LegendListItem
            legendEntry={{ title: "8 to 9", color: getUniqueColor(0) }}
          ></LegendListItem>
          <LegendListItem
            legendEntry={{ title: "10 to 12", color: getUniqueColor(1) }}
          ></LegendListItem>
          <LegendListItem
            legendEntry={{ title: "13 to 20", color: getUniqueColor(2) }}
          ></LegendListItem>
          <LegendListItem
            legendEntry={{ title: "20+", color: getUniqueColor(3) }}
          ></LegendListItem>
          <LegendListItem
            legendEntry={{ title: "Not Entered", color: getUniqueColor(4) }}
          ></LegendListItem>
        </>
      )}
      {props.data &&
        props.selectedCategory === "ethnicity" &&
        (() => {
          let legendListItems: React.ReactElement[] = [];

          let i = 0;
          for (const ethnicity in props.data.ethnicity) {
            legendListItems.push(
              <LegendListItem
                legendEntry={{ title: ethnicity, color: getUniqueColor(i) }}
              ></LegendListItem>
            );
            ++i;
          }

          return legendListItems;
        })()}
      {props.data &&
        props.selectedCategory === "birthLocation" &&
        (() => {
          let legendListItems: React.ReactElement[] = [];

          let i = 0;
          for (const birthLocation in props.data.birthLocation) {
            legendListItems.push(
              <LegendListItem
                legendEntry={{ title: birthLocation, color: getUniqueColor(i) }}
              ></LegendListItem>
            );
            ++i;
          }

          return legendListItems;
        })()}
    </StyledLegend>
  );
};

const StyledLegend = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  grid-area: legend;
`;

const LegendListItem: React.FC<{ legendEntry: LegendEntry }> = (props) => {
  return (
    <StyledLegendListItem>
      <LegendListItemColorBlock
        color={props.legendEntry.color}
      ></LegendListItemColorBlock>
      <LegendListItemTitle variant="caption">
        {props.legendEntry.title}
      </LegendListItemTitle>
    </StyledLegendListItem>
  );
};

const StyledLegendListItem = styled.div`
  display: flex;
`;

const LegendListItemColorBlock = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  width: 1rem;
  height: 1rem;
  margin-right: 1rem;
`;

const LegendListItemTitle = styled(Typography)``;

export default MenteeDemographicsCard;
