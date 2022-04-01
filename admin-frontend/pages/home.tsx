import React from "react";
import { NextPage } from "next";
import styled from "styled-components";
import { MOBILE_BREAKPOINT } from "../constants/constants";
import SessionStatsCard from "../components/pages/home/sessionStatsCard";
import MentorDemographicsCard from "../components/pages/home/mentorDemographicsCard";
import MenteeDemographicsCard from "../components/pages/home/menteeDemographicsCard";
import MentorSessionTrackingCard from "../components/pages/home/MentorSessionTrackingCard";
import MentorQuestionnaireTrackingCard from "../components/pages/home/MentorQuestionnaireTrackingCard";

const Home: NextPage = () => {
  return (
    <HomePageLayout>
      <MentorSessionTrackingCard></MentorSessionTrackingCard>
      <MentorQuestionnaireTrackingCard></MentorQuestionnaireTrackingCard>
      <MentorDemographicsCard></MentorDemographicsCard>
      <MenteeDemographicsCard></MenteeDemographicsCard>
      <SessionStatsCard></SessionStatsCard>
    </HomePageLayout>
  );
};

const HomePageLayout = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-gap: 1rem;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    "mentorSessionTrackingCard mentorQuestionnaireTrackingCard"
    "mentorDemographicsCard menteeDemographicsCard"
    "sessionStatsCard sessionStatsCard";

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, 1fr);
    grid-template-areas:
      "mentorSessionTrackingCard"
      "mentorQuestionnaireTrackingCard"
      "mentorDemographicsCard"
      "menteeDemographicsCard"
      "sessionStatsCard";
  }
`;

export default Home;
