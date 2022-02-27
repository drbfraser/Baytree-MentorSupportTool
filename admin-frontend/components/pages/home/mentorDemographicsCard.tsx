import Paper from "@mui/material/Paper";
import styled from "styled-components";
import { MOBILE_BREAKPOINT } from "../../../constants/constants";

const MentorDemographicsCard: React.FC<{}> = () => {
    return <StyledMentorDemographicsCard>
    </StyledMentorDemographicsCard>;
}

const StyledMentorDemographicsCard = styled(Paper)`
  width: 100%;
  height: 100%;
  grid-area: mentorDemographicsCard;
`;

export default MentorDemographicsCard;