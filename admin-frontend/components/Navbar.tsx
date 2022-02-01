import { Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
import {
  baytreeLogoUrl,
  changingAspirationsUrl,
} from "../public/images/imageUrls";
import sidebarLinks, { SidebarLink } from "./SidebarLinks";

const Navbar: React.FC<{}> = () => {
  return (
    <>
      <Topbar
        logoUrl={baytreeLogoUrl}
        logoPadding="0.4rem"
        sloganImageUrl={changingAspirationsUrl}
        title="Admin Portal"
      ></Topbar>
      <Sidebar links={sidebarLinks}></Sidebar>
    </>
  );
};

interface TopBarProps {
  logoUrl: string;
  logoPadding?: string;
  sloganImageUrl: string;
  title: string;
}

const Topbar: React.FC<TopBarProps> = (props) => {
  return (
    <StyledTopBar>
      <Logo src={props.logoUrl} width="7rem" padding={props.logoPadding}></Logo>
      <Logo src={props.sloganImageUrl} width="8rem"></Logo>
      <Typography>{props.title}</Typography>
    </StyledTopBar>
  );
};

const StyledTopBar = styled.div`
  background: white;
  width: 100%;
  height: ${"5rem"};
  box-shadow: 0 0 6px 4px lightgrey;
`;

interface LogoProps {
  width: string;
  height?: string;
  padding?: string;
}

const Logo = styled.img<LogoProps>`
  width: ${(props) => props.width};
  height: ${(props) => props.height ?? "5rem"};
  padding: ${(props) => (props.padding ? props.padding : null)};
`;

interface SidebarProps {
  links: SidebarLink[];
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  return <StyledSidebar></StyledSidebar>;
};

const StyledSidebar = styled.div`
  width: 14rem;
  background: white;
  height: ${() => `calc(100vh - ${"5rem"})`};
  left: 0;
  top: ${() => "5rem"};
  position: fixed;
  box-shadow: 0 9px 6px 4px lightgrey;
`;

export default Navbar;
