import Paper from '@mui/material/Paper'
import styled from 'styled-components'
import {
  COLORS,
  HELP_MESSAGE,
  MOBILE_BREAKPOINT
} from '../../../constants/constants'

import React, { PureComponent, useEffect, useState } from 'react'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts'
import { Button, ButtonGroup, Skeleton, Typography } from '@mui/material'
import {
  getVolunteersFromViews,
  Volunteer
} from '../../../api/backend/views/volunteers'
import moment from 'moment'
import { toast } from 'react-toastify'
import { stringify } from 'querystring'

interface MentorDemographicsData {
  age: {
    age15To19: number
    age20To30: number
    age30To40: number
    age40Plus: number
    notEntered: number
  }
  ethnicity: Record<string, number>
  firstLanguage: Record<string, number>
}

type DemographicCategory = 'age' | 'ethnicity' | 'firstLanguage'

const MentorDemographicsCard: React.FC<{}> = () => {
  const [loadingData, setLoadingData] = useState(false)
  const [data, setData] = useState<MentorDemographicsData | null>(null)
  const [selectedDemographicCategory, setSelectedDemographicCategory] =
    useState<DemographicCategory>('age')

  const getAgeInYearsFromBirthDate = (birthDate: Date | null) => {
    return moment().diff(birthDate, 'years')
  }

  const getVolunteersInAgeRange = (
    volunteers: Volunteer[],
    minAge: number,
    maxAge?: number
  ) => {
    return volunteers.filter((volunteer) => {
      const volunteerAgeInYears = getAgeInYearsFromBirthDate(
        volunteer.dateOfBirth
      )
      return (
        volunteerAgeInYears >= minAge &&
        (!maxAge || volunteerAgeInYears <= maxAge)
      )
    })
  }

  const getVolunteersAgeNotEntered = (volunteers: Volunteer[]) => {
    return volunteers.filter((volunteer) => {
      return !volunteer.dateOfBirth
    })
  }

  const getVolunteerEthnicityCounts = (volunteers: Volunteer[]) => {
    const ethnicityCounts: Record<string, number> = {}
    for (const volunteer of volunteers) {
      const ethnicity = volunteer.ethnicity ?? 'Not Entered'
      if (ethnicity in ethnicityCounts) {
        ethnicityCounts[ethnicity] += 1
      } else {
        ethnicityCounts[ethnicity] = 1
      }
    }

    return ethnicityCounts
  }

  const getVolunteerFirstLanguageCounts = (volunteers: Volunteer[]) => {
    const firstLanguageCounts: Record<string, number> = {}
    for (const volunteer of volunteers) {
      const firstLanguage = volunteer.firstLanguage ?? 'Not Entered'
      if (firstLanguage in firstLanguageCounts) {
        firstLanguageCounts[firstLanguage] += 1
      } else {
        firstLanguageCounts[firstLanguage] = 1
      }
    }

    return firstLanguageCounts
  }

  useEffect(() => {
    async function getMentorDemographicsData() {
      setLoadingData(true)
      const volunteers = await getVolunteersFromViews()
      if (volunteers && volunteers.data) {
        const mentorDemographicsData: MentorDemographicsData = {
          age: {
            age15To19: getVolunteersInAgeRange(volunteers.data, 15, 19).length,
            age20To30: getVolunteersInAgeRange(volunteers.data, 20, 30).length,
            age30To40: getVolunteersInAgeRange(volunteers.data, 30, 40).length,
            age40Plus: getVolunteersInAgeRange(volunteers.data, 40).length,
            notEntered: getVolunteersAgeNotEntered(volunteers.data).length
          },
          ethnicity: getVolunteerEthnicityCounts(volunteers.data),
          firstLanguage: getVolunteerFirstLanguageCounts(volunteers.data)
        }

        setData(mentorDemographicsData)
      } else {
        toast.error(HELP_MESSAGE)
      }

      setLoadingData(false)
    }

    getMentorDemographicsData()
  }, [])

  return (
    <StyledMentorDemographicsCard>
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
    </StyledMentorDemographicsCard>
  )
}

const StyledMentorDemographicsCard = styled(Paper)`
  width: 100%;
  height: 100%;
  padding: 1rem 2rem 1rem 2rem;
  display: grid;
  grid-area: mentorDemographicsCard;
  grid-template-columns: 1.5fr 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    'header header'
    'chart legend';
`

const Header: React.FC<{
  selectedDemographicCategory: DemographicCategory
  setSelectedDemographicCategory: React.Dispatch<
    React.SetStateAction<DemographicCategory>
  >
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
  )
}

const StyledHeader = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-area: header;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    'title moreInfo'
    'options options';
`

const Title: React.FC<{}> = () => {
  return (
    <StyledTitle>
      <Typography variant="h5">Mentor Demographics</Typography>
    </StyledTitle>
  )
}

const StyledTitle = styled.div`
  grid-area: title;
`

const MoreInfoButton: React.FC<{}> = () => {
  return (
    <StyledMoreInfoButton>
      <Button variant="outlined" color="success">
        More
      </Button>
    </StyledMoreInfoButton>
  )
}

const StyledMoreInfoButton = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-area: moreInfo;
`

const StyledMoreInfoText = styled(Typography)`
  text-decoration: underline;
  :hover {
    cursor: pointer;
  }
`

const Options: React.FC<{
  selectedDemographicCategory: DemographicCategory
  setSelectedDemographicCategory: React.Dispatch<
    React.SetStateAction<DemographicCategory>
  >
}> = (props) => {
  return (
    <StyledOptions>
      <ButtonGroup variant="outlined" color="success">
        <Button
          variant={
            props.selectedDemographicCategory === 'age'
              ? 'contained'
              : 'outlined'
          }
          onClick={() => {
            props.setSelectedDemographicCategory('age')
          }}
        >
          Age
        </Button>
        <Button
          variant={
            props.selectedDemographicCategory === 'ethnicity'
              ? 'contained'
              : 'outlined'
          }
          onClick={() => {
            props.setSelectedDemographicCategory('ethnicity')
          }}
        >
          Ethnicity
        </Button>
        <Button
          variant={
            props.selectedDemographicCategory === 'firstLanguage'
              ? 'contained'
              : 'outlined'
          }
          onClick={() => {
            props.setSelectedDemographicCategory('firstLanguage')
          }}
        >
          First Language
        </Button>
      </ButtonGroup>
    </StyledOptions>
  )
}

const StyledOptions = styled.div`
  grid-area: options;
  padding-top: 0.3rem;
`

const Chart: React.FC<{
  data: MentorDemographicsData | null
  selectedDemographicCategory: DemographicCategory
}> = (props) => {
  // Pie Chart Example: https://recharts.org/en-US/examples/PieChartWithCustomizedLabel

  const convertDemographicDataToPieChartData = (
    demographicData: MentorDemographicsData | null,
    selectedDemographicCategory: DemographicCategory
  ) => {
    if (demographicData === null) {
      return []
    }

    switch (selectedDemographicCategory) {
      case 'age':
        return [
          { name: 'Age15To19', value: demographicData.age.age15To19 },
          { name: 'Age20To30', value: demographicData.age.age20To30 },
          { name: 'Age30To40', value: demographicData.age.age30To40 },
          { name: 'Age40Plus', value: demographicData.age.age40Plus },
          { name: 'AgeNotEntered', value: demographicData.age.notEntered }
        ]
      case 'firstLanguage':
        const firstLanguageData: { name: string; value: number }[] = []

        for (const firstLanguage in demographicData.firstLanguage) {
          firstLanguageData.push({
            name: firstLanguage,
            value: demographicData.firstLanguage[firstLanguage]
          })
        }
        return firstLanguageData
      case 'ethnicity':
        const ethnicityData: { name: string; value: number }[] = []

        for (const ethnicity in demographicData.ethnicity) {
          ethnicityData.push({
            name: ethnicity,
            value: demographicData.ethnicity[ethnicity]
          })
        }
        return ethnicityData
    }
  }

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }: {
    cx: number
    cy: number
    midAngle: number
    innerRadius: number
    outerRadius: number
    percent: number
    index: number
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

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
  )
}

const StyledChart = styled.div`
  grid-area: chart;
  overflow: hidden; // fixes resizing issues***
`

interface LegendEntry {
  title: string
  color: string
}

const Legend: React.FC<{
  selectedCategory: DemographicCategory
  data: MentorDemographicsData | null
}> = (props) => {
  const getUniqueColor = (n: number) => {
    return COLORS[n % COLORS.length]
  }

  return (
    <StyledLegend>
      {props.data && props.selectedCategory === 'age' && (
        <>
          <LegendListItem
            key={`MentorLegendListItem_${0}`}
            legendEntry={{ title: '15 to 19', color: getUniqueColor(0) }}
          ></LegendListItem>
          <LegendListItem
            key={`MentorLegendListItem_${1}`}
            legendEntry={{ title: '20 to 30', color: getUniqueColor(1) }}
          ></LegendListItem>
          <LegendListItem
            key={`MentorLegendListItem_${2}`}
            legendEntry={{ title: '30 to 40', color: getUniqueColor(2) }}
          ></LegendListItem>
          <LegendListItem
            key={`MentorLegendListItem_${3}`}
            legendEntry={{ title: '40+', color: getUniqueColor(3) }}
          ></LegendListItem>
          <LegendListItem
            key={`MentorLegendListItem_${4}`}
            legendEntry={{ title: 'Not Entered', color: getUniqueColor(4) }}
          ></LegendListItem>
        </>
      )}
      {props.data &&
        props.selectedCategory === 'ethnicity' &&
        (() => {
          const legendListItems: React.ReactElement[] = []

          let i = 0
          for (const ethnicity in props.data.ethnicity) {
            legendListItems.push(
              <LegendListItem
                key={`MentorLegendListItem_${i}`}
                legendEntry={{ title: ethnicity, color: getUniqueColor(i) }}
              ></LegendListItem>
            )
            ++i
          }

          return legendListItems
        })()}
      {props.data &&
        props.selectedCategory === 'firstLanguage' &&
        (() => {
          const legendListItems: React.ReactElement[] = []

          let i = 0
          for (const firstLanguage in props.data.firstLanguage) {
            legendListItems.push(
              <LegendListItem
                key={`MentorLegendListItem_${i}`}
                legendEntry={{ title: firstLanguage, color: getUniqueColor(i) }}
              ></LegendListItem>
            )
            ++i
          }

          return legendListItems
        })()}
    </StyledLegend>
  )
}

const StyledLegend = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  grid-area: legend;
`

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
  )
}

const StyledLegendListItem = styled.div`
  display: flex;
`

const LegendListItemColorBlock = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  width: 1rem;
  height: 1rem;
  margin-right: 1rem;
`

const LegendListItemTitle = styled(Typography)`
  flex: 1;
`

export default MentorDemographicsCard
