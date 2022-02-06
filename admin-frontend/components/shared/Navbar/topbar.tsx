import { Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import { IconBaseProps } from "react-icons";
import { MdMenu } from "react-icons/md";
import styled from "styled-components";
import { BAYTREE_PRIMARY_COLOR, TOPBAR_HEIGHT } from "../../../context/constants";
import Modal, { ModalComponent } from "../Modal";
import Logo from "./logo";
import { NAVBAR_ICON_SIZE } from "./navbar";
import { TopbarAction } from "./topbarActions";

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
        hoverColor={`${props.color ?? BAYTREE_PRIMARY_COLOR}30`}
        onClick={() => {
          props.onClick ? props.onClick() : setIsModalOpen(!isModalOpen);
        }}
        ref={props.Ref}
      >
        {React.createElement(props.icon, {
          color: props.color ?? BAYTREE_PRIMARY_COLOR,
          size: NAVBAR_ICON_SIZE,
        })}
      </StyledTopbarActionButton>
      {props.modalComponent && (
        <Modal
          isOpen={isModalOpen}
          onOutsideClick={() => {
            console.log("hey3");
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

export default Topbar;
