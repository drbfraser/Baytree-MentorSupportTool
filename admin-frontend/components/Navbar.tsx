import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import {
  baytreeLogoUrl,
  changingAspirationsUrl,
} from "../public/images/imageUrls";
import Icon, { IconType } from "./icons";
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
      <div style={{ display: "flex"}}>
        <Logo
          src={props.logoUrl}
          width="7rem"
          padding={props.logoPadding}
        ></Logo>
        <Logo src={props.sloganImageUrl} width="8rem"></Logo>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: "1rem"
          }}
        >
          <Typography variant="h5">{props.title}</Typography>
        </div>
      </div>
    </StyledTopBar>
  );
};

const StyledTopBar = styled.div`
  background: white;
  width: 100%;
  height: ${"5rem"};
  box-shadow: 0 0 0.4rem 0.2rem lightgrey;
  position: fixed;
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
  return (
    <StyledSidebar>
      {sidebarLinks.map((link) => (
        <SidebarItem
          icon={link.icon}
          text={link.title}
          url={link.url}
        ></SidebarItem>
      ))}
    </StyledSidebar>
  );
};

const StyledSidebar = styled.div`
  width: 14rem;
  background: white;
  height: ${() => `calc(100vh - ${"5rem"})`};
  left: 0;
  top: ${() => "5rem"};
  position: fixed;
  box-shadow: 0 9px 0.4rem 0.2rem lightgrey;
`;

interface SidebarItemProps {
  text: string;
  icon: IconType;
  url: string;
}

const SidebarItem: React.FC<SidebarItemProps> = (props) => {
  const router = useRouter();

  return (
    <StyledSidebarItem onClick={() => router.push(props.url)}>
      <SidebarItemIcon>
        <Icon icon={props.icon} color="#5AB031" size="1.6rem"></Icon>
      </SidebarItemIcon>
      <SidebarItemText>{props.text}</SidebarItemText>
    </StyledSidebarItem>
  );
};

const StyledSidebarItem = styled.div`
  display: flex;
  justify-content: left;
  width: 100%;
  height: 4rem;
  :hover {
    text-decoration: underline;
    cursor: pointer;
    background: #59b03145;
    user-select: none;
  }
`;

const SidebarItemIcon = styled.div`
  margin: auto 0 auto 2rem;
`;

const SidebarItemText = styled(Typography)`
  margin: auto 0 auto 2rem;
`;
export default Navbar;
