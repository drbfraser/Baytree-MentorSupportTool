import React from "react";
import { NextPage } from "next";
import styled from "styled-components";
import { MOBILE_BREAKPOINT } from "../constants/constants";
import SessionStatsCard from "../components/pages/home/sessionStatsCard";
import MentorDemographicsCard from "../components/pages/home/mentorDemographicsCard";
import MenteeDemographicsCard from "../components/pages/home/menteeDemographicsCard";

const Home: NextPage = () => {
  return (
    <HomePageLayout>
      <SessionStatsCard></SessionStatsCard>
      <MentorDemographicsCard></MentorDemographicsCard>
      <MenteeDemographicsCard></MenteeDemographicsCard>
    </HomePageLayout>
  );
};

const HomePageLayout = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-gap: 1rem;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1.5fr 1fr;
  grid-template-areas:
    "sessionStatsCard sessionStatsCard"
    "mentorDemographicsCard menteeDemographicsCard";

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 1fr);
    grid-template-areas:
      "sessionStatsCard"
      "mentorDemographicsCard"
      "menteeDemographicsCard";
  }
`;

export default Home;
