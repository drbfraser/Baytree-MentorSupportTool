import Paper from "@mui/material/Paper";
import styled from "styled-components";
import { COLORS, HELP_MESSAGE } from "../../../constants/constants";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Button, ButtonGroup, Skeleton, Typography } from "@mui/material";
import moment from "moment";
import { toast } from "react-toastify";
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
  firstLanguage: Record<string, number>;
}

type DemographicCategory = "age" | "ethnicity" | "firstLanguage";

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

  const getParticipantFirstLanguageCounts = (participants: Participant[]) => {
    let firstLanguageCounts: Record<string, number> = {};
    for (const participant of participants) {
      const firstLanguage = participant.firstLanguage ?? "Not Entered";
      if (firstLanguage in firstLanguageCounts) {
        firstLanguageCounts[firstLanguage] += 1;
      } else {
        firstLanguageCounts[firstLanguage] = 1;
      }
    }

    return firstLanguageCounts;
  };

  useEffect(() => {
    async function getMenteeDemographicsData() {
      setLoadingData(true);
      const participants = await getParticipantsFromViews();
      if (participants) {
        const menteeDemographicsData: MenteeDemographicsData = {
          age: {
            age8To9: getParticipantsInAgeRange(participants.results, 8, 9)
              .length,
            age10To12: getParticipantsInAgeRange(participants.results, 10, 12)
              .length,
            age13To20: getParticipantsInAgeRange(participants.results, 13, 20)
              .length,
            age20Plus: getParticipantsInAgeRange(participants.results, 20)
              .length,
            notEntered: getParticipantsAgeNotEntered(participants.results)
              .length,
          },
          ethnicity: getParticipantEthnicityCounts(participants.results),
          firstLanguage: getParticipantFirstLanguageCounts(participants.results),
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
  grid-template-rows: auto auto;
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
      <Button variant="outlined" color="success">
        More
      </Button>
    </StyledMoreInfoButton>
  );
};

const StyledMoreInfoButton = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-area: moreInfo;
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
            props.selectedDemographicCategory === "firstLanguage"
              ? "contained"
              : "outlined"
          }
          onClick={() => {
            props.setSelectedDemographicCategory("firstLanguage");
          }}
        >
          First Language
        </Button>
      </ButtonGroup>
    </StyledOptions>
  );
};

const StyledOptions = styled.div`
  grid-area: options;
  padding-top: 0.3rem;
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
      case "firstLanguage":
        let firstLanguageData: { name: string; value: number }[] = [];

        for (const firstLanguage in demographicData.firstLanguage) {
          firstLanguageData.push({
            name: firstLanguage,
            value: demographicData.firstLanguage[firstLanguage],
          });
        }
        return firstLanguageData;
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
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <StyledChart>
      <ResponsiveContainer height={200}>
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
            isAnimationActive={false}
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
  overflow: hidden;
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
            key={`MenteeLegendListItem_${0}`}
            legendEntry={{ title: "8 to 9", color: getUniqueColor(0) }}
          ></LegendListItem>
          <LegendListItem
            key={`MenteeLegendListItem_${1}`}
            legendEntry={{ title: "10 to 12", color: getUniqueColor(1) }}
          ></LegendListItem>
          <LegendListItem
            key={`MenteeLegendListItem_${2}`}
            legendEntry={{ title: "13 to 20", color: getUniqueColor(2) }}
          ></LegendListItem>
          <LegendListItem
            key={`MenteeLegendListItem_${3}`}
            legendEntry={{ title: "20+", color: getUniqueColor(3) }}
          ></LegendListItem>
          <LegendListItem
            key={`MenteeLegendListItem_${4}`}
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
                key={`MenteeLegendListItem_${i}`}
                legendEntry={{ title: ethnicity, color: getUniqueColor(i) }}
              ></LegendListItem>
            );
            ++i;
          }

          return legendListItems;
        })()}
      {props.data &&
        props.selectedCategory === "firstLanguage" &&
        (() => {
          let legendListItems: React.ReactElement[] = [];

          let i = 0;
          for (const firstLanguage in props.data.firstLanguage) {
            legendListItems.push(
              <LegendListItem
                key={`MenteeLegendListItem_${i}`}
                legendEntry={{ title: firstLanguage, color: getUniqueColor(i) }}
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

const LegendListItemTitle = styled(Typography)`
  flex: 1;
`;

export default MenteeDemographicsCard;
