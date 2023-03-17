import React, { useEffect, useRef, useState } from 'react'
import { NextPage } from 'next'
import styled from 'styled-components'
import { MOBILE_BREAKPOINT } from '../constants/constants'
import MentorDemographicsCard from '../components/pages/home/mentorDemographicsCard'
import MenteeDemographicsCard from '../components/pages/home/menteeDemographicsCard'
import MentorSessionTrackingCard from '../components/pages/home/MentorSessionTrackingCard/MentorSessionTrackingCard/MentorSessionTrackingCard'
import MentorQuestionnaireTrackingCard from '../components/pages/home/MentorQuestionnaireTrackingCard'
import { getVolunteersFromViews } from '../api/backend/views/volunteers'
import { toast } from 'react-toastify'
import { getMentorUsers, MentorUser } from '../api/backend/mentorUsers'

export interface Mentor {
  viewsPersonId: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
}

const Home: NextPage = () => {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [mentorFilter, setMentorFilter] = useState('')

  useEffect(() => {
    // Use timeouts to debounce input so no searching is done until 1 second
    // after to eliminate choppy typing
    const DEBOUNCE_TIME = 1000 // 1 second
    clearTimeout(delayTimerRef.current as number)
    delayTimerRef.current = setTimeout(function () {
      setFilteredMentors(
        mentors.filter((mentor) => {
          return (
            mentorFilter === '' ||
            mentor.fullName
              .toLowerCase()
              .includes(mentorFilter.toLowerCase()) ||
            mentor.email.toLowerCase().includes(mentorFilter.toLowerCase())
          )
        })
      )
    }, DEBOUNCE_TIME)
  }, [mentorFilter])

  useEffect(() => {
    setFilteredMentors(mentors)
  }, [mentors])

  const delayTimerRef = useRef<NodeJS.Timeout | number | undefined>(undefined)

  useEffect(() => {
    const getMentorsFromViews = async () => {
      const ERROR_MESSAGE =
        'Something went wrong! Please contact technical support for further assistance.'

      const volunteersRes = await getVolunteersFromViews()
      if (volunteersRes && volunteersRes.status === 200 && volunteersRes.data) {
        const mentorsRes = (await getMentorUsers()) as MentorUser[] | null
        if (mentorsRes) {
          setMentors(
            mentorsRes.map((mentor) => {
              const matchingVolunteer = volunteersRes.data.find(
                (volunteer) => volunteer.viewsPersonId === mentor.viewsPersonId
              )

              return {
                viewsPersonId: mentor.viewsPersonId,
                email: mentor.user.email,
                firstName: matchingVolunteer ? matchingVolunteer.firstname : '',
                lastName: matchingVolunteer ? matchingVolunteer.surname : '',
                fullName: matchingVolunteer
                  ? `${matchingVolunteer.firstname} ${matchingVolunteer.surname}`
                  : '',
              }
            })
          )
        } else {
          toast.error(ERROR_MESSAGE)
        }
      } else {
        toast.error(ERROR_MESSAGE)
      }
    }

    getMentorsFromViews()
  }, [])

  return (
    <HomePageLayout>
      <MentorSessionTrackingCard
        mentorFilter={mentorFilter}
        setMentorFilter={setMentorFilter}
        mentors={filteredMentors}
      ></MentorSessionTrackingCard>
      <MentorQuestionnaireTrackingCard></MentorQuestionnaireTrackingCard>
      <MentorDemographicsCard></MentorDemographicsCard>
      <MenteeDemographicsCard></MenteeDemographicsCard>
    </HomePageLayout>
  )
}

const HomePageLayout = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-gap: 1rem;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, auto);
  grid-template-areas:
    "mentorSessionTrackingCard mentorSessionTrackingCard"
    "mentorQuestionnaireTrackingCard mentorQuestionnaireTrackingCard"
    "mentorDemographicsCard menteeDemographicsCard";

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    grid-template-areas:
      "mentorSessionTrackingCard"
      "mentorQuestionnaireTrackingCard"
      "mentorDemographicsCard"
      "menteeDemographicsCard";
  }
`

export default Home
