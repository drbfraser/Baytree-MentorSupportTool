import Paper from "@mui/material/Paper";
import styled from "styled-components";
import { MOBILE_BREAKPOINT } from "../../../constants/constants";

const MenteeDemographicsCard: React.FC<{}> = () => {
    return <StyledMenteeDemographicsCard></StyledMenteeDemographicsCard>;
}

const StyledMenteeDemographicsCard = styled(Paper)`
  width: 100%;
  height: 100%;
  grid-area: menteeDemographicsCard;
`;

export default MenteeDemographicsCard;