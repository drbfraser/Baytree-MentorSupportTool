import { Typography, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IconBaseProps } from "react-icons";
import { MdMenu } from "react-icons/md";
import styled from "styled-components";
import {
  MOBILE_BREAKPOINT,
  SIDEBAR_WIDTH,
  TOPBAR_HEIGHT,
} from "../../context/constants";
import siteContext from "../../context/siteContext";
import {
  baytreeLogoUrl,
  changingAspirationsUrl,
} from "../../public/images/imageUrls";
import Modal, { ModalComponent } from "../Modal";
import { SidebarLink } from "./sidebarLinks";
import { TopbarAction } from "./topbarActions";

const ICON_SIZE = "1.6rem";
const ICON_COLOR = "#5AB031";

interface NavbarProps {
  useMobileLayout: boolean;
  sidebarActive: boolean;
  setSidebarActive: (active: boolean) => void;
  sidebarLinks?: SidebarLink[];
  topbarActions?: TopbarAction[];
}

const Navbar: React.FC<NavbarProps> = (props) => {
  useEffect(() => {
    if (props.useMobileLayout) {
      props.setSidebarActive(false);
    } else {
      props.setSidebarActive(true);
    }
  }, [props.useMobileLayout]);

  const sidebarElementRef = useRef<HTMLDivElement>(null);
  const hamburgerMenuButtonElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarElementRef.current &&
        hamburgerMenuButtonElementRef.current &&
        !sidebarElementRef.current.contains(event.target as Node) &&
        !hamburgerMenuButtonElementRef.current.contains(event.target as Node)
      ) {
        props.setSidebarActive(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarElementRef]);

  return (
    <>
      <Topbar
        useMobileLayout={props.useMobileLayout}
        logoUrl={baytreeLogoUrl}
        logoPadding="0.4rem"
        sloganImageUrl={changingAspirationsUrl}
        title="Admin Portal"
        actions={props.topbarActions ?? []}
        toggleSidebarMenu={() => {
          props.setSidebarActive(!props.sidebarActive);
        }}
        hamburgerMenuRef={hamburgerMenuButtonElementRef}
      ></Topbar>
      {props.sidebarActive && (
        <Sidebar
          Ref={sidebarElementRef}
          links={props.sidebarLinks ?? []}
          topbarActions={props.topbarActions ?? []}
          useMobileLayout={props.useMobileLayout}
          setSidebarActive={props.setSidebarActive}
        ></Sidebar>
      )}
    </>
  );
};

interface TopBarProps {
  logoUrl: string;
  logoPadding?: string;
  sloganImageUrl: string;
  title: string;
  actions: TopbarAction[];
  useMobileLayout: boolean;
  toggleSidebarMenu: () => void;
  hamburgerMenuRef: React.RefObject<HTMLDivElement>;
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
          {!props.useMobileLayout && (
            <Logo src={props.sloganImageUrl} width="8rem"></Logo>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: "1rem",
            }}
          >
            {!props.useMobileLayout && (
              <Typography variant="h5">{props.title}</Typography>
            )}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {props.useMobileLayout ? (
            <TopbarActionButton
              Ref={props.hamburgerMenuRef}
              icon={MdMenu}
              onClick={props.toggleSidebarMenu}
            ></TopbarActionButton>
          ) : (
            props.actions.map((action, i) => (
              <TopbarActionButton
                key={`toolbar_action_button_${i}`}
                icon={action.icon}
                modalComponent={action.modalComponent}
                modalWidth={action.modalWidth}
                modalHeight={action.modalHeight}
                color={action.iconColor}
              ></TopbarActionButton>
            ))
          )}
        </div>
      </div>
    </StyledTopBar>
  );
};

const StyledTopBar = styled.div`
  background: white;
  width: 100%;
  height: ${TOPBAR_HEIGHT};
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
  topbarActions: TopbarAction[];
  useMobileLayout: boolean;
  setSidebarActive: (active: boolean) => void;
  Ref: React.MutableRefObject<any>;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const router = useRouter();

  return (
    <StyledSidebar ref={props.Ref}>
      {props.links.map((link, i) => (
        <SidebarItem
          key={`sidebar_item_${i}`}
          icon={link.icon}
          text={link.title}
          url={link.url}
          isSelected={link.url == router.pathname}
          setSidebarActive={props.setSidebarActive}
          useMobileLayout={props.useMobileLayout}
          modalComponent={link.modalComponent}
          modalHeight={link.modalHeight}
          modalWidth={link.modalWidth}
        ></SidebarItem>
      ))}
      {props.useMobileLayout &&
        props.topbarActions.map((actionButton, i) => {
          return (
            <SidebarItem
              key={`sidebar_action_item_${i}`}
              icon={actionButton.icon}
              iconColor={actionButton.iconColor}
              text={actionButton.title}
              setSidebarActive={props.setSidebarActive}
              useMobileLayout={props.useMobileLayout}
              modalComponent={actionButton.modalComponent}
              modalHeight={actionButton.modalHeight}
              modalWidth={actionButton.modalWidth}
            ></SidebarItem>
          );
        })}
    </StyledSidebar>
  );
};

const StyledSidebar = styled.div`
  width: ${SIDEBAR_WIDTH};
  background: white;
  height: ${() => `calc(100vh - ${"5rem"})`};
  left: 0;
  top: ${() => "5rem"};
  position: fixed;
  box-shadow: 0 0.5rem 0.4rem 0.2rem lightgrey;
`;

interface SidebarItemProps {
  text: string;
  icon: React.FC<IconBaseProps>;
  iconColor?: string;
  url?: string;
  modalComponent?: ModalComponent;
  modalWidth?: string;
  modalHeight?: string;
  setSidebarActive: (active: boolean) => void;
  useMobileLayout: boolean;
  isSelected?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = (props) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <StyledSidebarItem
        isSelected={props.isSelected}
        onClick={() => {
          if (props.useMobileLayout && !props.modalComponent) {
            props.setSidebarActive(false);
          }
          if (props.url) {
            router.push(props.url);
          } else {
            setShowModal(true);
          }
        }}
      >
        <SidebarItemIcon>
          {React.createElement(props.icon, {
            color: props.iconColor ?? ICON_COLOR,
            size: ICON_SIZE,
          })}
        </SidebarItemIcon>
        <SidebarItemText>{props.text}</SidebarItemText>
      </StyledSidebarItem>
      {props.modalComponent && (
        <Modal
          isOpen={showModal}
          modalComponent={props.modalComponent}
          onOutsideClick={() => {
            setShowModal(false);
          }}
          useMobileLayout={props.useMobileLayout}
        ></Modal>
      )}
    </>
  );
};

const StyledSidebarItem = styled.div<{ isSelected?: boolean }>`
  display: flex;
  justify-content: left;
  width: 100%;
  height: 4rem;
  background: ${(props) => (props.isSelected ? `${ICON_COLOR}30` : "")};
  @media (hover: hover) {
    :hover {
      text-decoration: underline;
      cursor: pointer;
      background: ${() => `${ICON_COLOR}30`};
      user-select: none;
    }
  }
`;

const SidebarItemIcon = styled.div`
  margin: auto 0 auto 2rem;
`;

const SidebarItemText = styled(Typography)`
  margin: auto 0 auto 2rem;
`;

interface TopbarActionProps {
  icon: React.FC<IconBaseProps>;
  onClick?: () => void;
  modalComponent?: ModalComponent;
  modalWidth?: string;
  modalHeight?: string;
  color?: string;
  Ref?: React.RefObject<HTMLDivElement>;
}

const TopbarActionButton: React.FC<TopbarActionProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <StyledTopbarActionButton
        hoverColor={`${props.color ?? ICON_COLOR}30`}
        onClick={() => {
          props.onClick ? props.onClick() : setIsModalOpen(!isModalOpen);
        }}
        ref={props.Ref}
      >
        {React.createElement(props.icon, {
          color: props.color ?? ICON_COLOR,
          size: ICON_SIZE,
        })}
      </StyledTopbarActionButton>
      {props.modalComponent && (
        <Modal
          isOpen={isModalOpen}
          onOutsideClick={() => {
            setIsModalOpen(false);
          }}
          modalComponent={props.modalComponent}
          width={props.modalWidth}
          height={props.modalHeight}
        ></Modal>
      )}
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
  @media (hover: hover) {
    :hover {
      text-decoration: underline;
      cursor: pointer;
      background: ${(props) => props.hoverColor};
      user-select: none;
    }
  }
`;

export default Navbar;
