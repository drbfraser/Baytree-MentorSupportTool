import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import siteContext from "../../context/siteContext";
import {
  baytreeLogoUrl,
  changingAspirationsUrl,
} from "../../public/images/imageUrls";
import Icon, { IconType } from "../icons";
import Modal, { ModalComponent } from "../Modal";
import sidebarLinks, { SidebarLink } from "./sidebarLinks";
import topbarActions, { TopbarAction } from "./topbarActions";

const ICON_SIZE = "1.6rem";
const ICON_COLOR = "#5AB031";
const Navbar: React.FC<{}> = () => {
  return (
    <>
      <Topbar
        logoUrl={baytreeLogoUrl}
        logoPadding="0.4rem"
        sloganImageUrl={changingAspirationsUrl}
        title="Admin Portal"
        actions={topbarActions}
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
  actions: TopbarAction[];
}

const Topbar: React.FC<TopBarProps> = (props) => {
  return (
    <StyledTopBar>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flex: 1 }}>
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
              paddingLeft: "1rem",
            }}
          >
            <Typography variant="h5">{props.title}</Typography>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {props.actions.map((action, i) => (
            <TopbarActionButton
              key={`toolbar_action_button_${i}`}
              icon={action.icon}
              modalComponent={action.modalComponent}
              modalWidth={action.modalWidth}
              modalHeight={action.modalHeight}
              color={action.color}
            ></TopbarActionButton>
          ))}
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
      {sidebarLinks.map((link, i) => (
        <SidebarItem
          key={`sidebar_item_${i}`}
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
        <Icon icon={props.icon} color={ICON_COLOR} size={ICON_SIZE}></Icon>
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
    background: ${() => `${ICON_COLOR}30`};
    user-select: none;
  }
`;

const SidebarItemIcon = styled.div`
  margin: auto 0 auto 2rem;
`;

const SidebarItemText = styled(Typography)`
  margin: auto 0 auto 2rem;
`;

interface TopbarActionProps {
  icon: IconType;
  modalComponent: ModalComponent;
  modalWidth?: string;
  modalHeight?: string;
  color?: string;
}

const TopbarActionButton: React.FC<TopbarActionProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <StyledTopbarActionButton
        hoverColor={`${props.color ?? ICON_COLOR}30`}
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        <Icon
          icon={props.icon}
          color={props.color ?? ICON_COLOR}
          size={ICON_SIZE}
        ></Icon>
      </StyledTopbarActionButton>
      <Modal
        isOpen={isModalOpen}
        onOutsideClick={() => {
          setIsModalOpen(false);
        }}
        modalComponent={props.modalComponent}
        width={props.modalWidth}
        height={props.modalHeight}
      ></Modal>
    </>
  );
};

const StyledTopbarActionButton = styled.div<{ hoverColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  width: 6rem;
  height: 100%;
  :hover {
    text-decoration: underline;
    cursor: pointer;
    background: ${(props) => props.hoverColor};
    user-select: none;
  }
`;

export default Navbar;
