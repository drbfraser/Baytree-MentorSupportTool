import React from "react";
import styled from "styled-components";
import {
  baytreeLogoUrl,
  changingAspirationsUrl,
} from "../public/images/imageUrls";

const TOP_BAR_HEIGHT = "5rem";
const Navbar: React.FC<{}> = () => {
  return (
    <TopBar
      logoUrl={baytreeLogoUrl}
      sloganImageUrl={changingAspirationsUrl}
    ></TopBar>
    // <SideBar>

    // </SideBar>
  );
};

interface TopBarProps {
  logoUrl: string;
  sloganImageUrl: string;
}

const TopBar: React.FC<TopBarProps> = (props) => {
  return (
    <StyledTopBar>
      <Logo src={props.logoUrl} width="7rem" padding="0.5rem"></Logo>
      <Logo src={props.sloganImageUrl} width="8rem"></Logo>
    </StyledTopBar>
  );
};

const StyledTopBar = styled.div`
  background: white;
  width: 100%;
  height: ${TOP_BAR_HEIGHT};
  box-shadow: 0 0 6px 0;
`;

interface LogoProps {
    width: string;
    height?: string;
    padding?: string;
}

const Logo = styled.img<LogoProps>`
    width: ${(props) => props.width};
    height: ${(props) => props.height ?? TOP_BAR_HEIGHT};
    padding: ${(props) => props.padding ? props.padding : null};
`;

export default Navbar;
