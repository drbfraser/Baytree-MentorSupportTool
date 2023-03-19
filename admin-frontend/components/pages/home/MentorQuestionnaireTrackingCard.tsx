import React from 'react'
import { Button, Paper, Typography } from '@mui/material'
import styled from 'styled-components'

const MentorQuestionnaireTrackingCard: React.FunctionComponent<{}> = () => {
  return (
    <CardLayout>
      <Header></Header>
      <Body></Body>
    </CardLayout>
  )
}

const CardLayout = styled(Paper)`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 0.1fr 0.9fr;
  grid-template-areas:
    "Header"
    "Body";
  grid-area: mentorQuestionnaireTrackingCard;
  padding: 1rem 2rem 1rem 2rem;
`

const Header: React.FunctionComponent<{}> = () => {
  return (
    <HeaderLayout>
      <HeaderTitle></HeaderTitle>
      <MoreButton></MoreButton>
    </HeaderLayout>
  )
}

const HeaderLayout = styled.div`
  display: flex;
  justify-content: space-between;
  grid-area: "Header";
`

const HeaderTitle: React.FunctionComponent<{}> = () => {
  return <Typography variant="h5">Questionnaires</Typography>
}

const MoreButton: React.FunctionComponent<{}> = () => {
  return (
    <Button variant="outlined" color="success">
      More
    </Button>
  )
}

const Body: React.FunctionComponent<{}> = () => {
  return <BodyLayout></BodyLayout>
}

const BodyLayout = styled.div`
  grid-area: "Body";
`

export default MentorQuestionnaireTrackingCard
