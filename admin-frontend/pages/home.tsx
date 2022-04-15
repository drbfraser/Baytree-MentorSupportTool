import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import styled from "styled-components";
import { MOBILE_BREAKPOINT } from "../constants/constants";
import SessionStatsCard from "../components/pages/home/sessionStatsCard";
import MentorDemographicsCard from "../components/pages/home/mentorDemographicsCard";
import MenteeDemographicsCard from "../components/pages/home/menteeDemographicsCard";
import MentorSessionTrackingCard from "../components/pages/home/MentorSessionTrackingCard/MentorSessionTrackingCard";
import MentorQuestionnaireTrackingCard from "../components/pages/home/MentorQuestionnaireTrackingCard";
import { getVolunteersFromViews } from "../api/backend/views/volunteers";
import { toast } from "react-toastify";
import { getMentorUsers } from "../api/backend/mentorUsers";

export interface Mentor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const Home: NextPage = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    const getMentorsFromViews = async () => {
      const ERROR_MESSAGE =
        "Something went wrong! Please contact technical support for further assistance.";

      const volunteersRes = await getVolunteersFromViews();
      if (volunteersRes && volunteersRes.status === 200 && volunteersRes.data) {
        const mentorsRes = await getMentorUsers();
        if (
          mentorsRes &&
          mentorsRes.status === 200 &&
          mentorsRes.data !== null
        ) {
          setMentors(
            mentorsRes.data.map((mentor) => {
              const matchingVolunteer = volunteersRes.data.find(
                (volunteer) => volunteer.viewsPersonId === mentor.viewsPersonId
              );

              return {
                id: mentor.user.id,
                email: mentor.user.email,
                firstName: matchingVolunteer ? matchingVolunteer.firstname : "",
                lastName: matchingVolunteer ? matchingVolunteer.surname : "",
              };
            })
          );
        } else {
          toast.error(ERROR_MESSAGE);
        }
      } else {
        toast.error(ERROR_MESSAGE);
      }
    };

    getMentorsFromViews();
  }, []);

  return (
    <HomePageLayout>
      <MentorSessionTrackingCard mentors={mentors}></MentorSessionTrackingCard>
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
  grid-template-rows: repeat(3, auto);
  grid-template-areas:
    "mentorSessionTrackingCard mentorQuestionnaireTrackingCard"
    "mentorDemographicsCard menteeDemographicsCard"
    "sessionStatsCard sessionStatsCard";

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, auto);
    grid-template-areas:
      "mentorSessionTrackingCard"
      "mentorQuestionnaireTrackingCard"
      "mentorDemographicsCard"
      "menteeDemographicsCard"
      "sessionStatsCard";
  }
`;

export default Home;
