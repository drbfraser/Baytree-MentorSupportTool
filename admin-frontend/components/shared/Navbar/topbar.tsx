import { Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import { IconBaseProps } from "react-icons";
import { MdMenu } from "react-icons/md";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { NAVBAR_Z_INDEX, TOPBAR_HEIGHT } from "../../../constants/constants";
import { RootState } from "../../../stores/store";
import Modal from "../Modal";
import Logo from "./logo";
import { NavbarModalComponent, NAVBAR_ICON_SIZE } from "./navbar";
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
  z-index: ${NAVBAR_Z_INDEX};
`;

interface TopbarActionProps {
  icon: React.FC<IconBaseProps>;
  onClick?: () => void;
  modalComponent?: NavbarModalComponent;
  modalWidth?: string;
  modalHeight?: string;
  color?: string;
  Ref?: React.RefObject<HTMLDivElement>;
}

const TopbarActionButton: React.FC<TopbarActionProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const primaryColor = useSelector<RootState, string>(
    (state) => state.theme.colors.primaryColor
  );

  const onOutsideModalClick = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <StyledTopbarActionButton
        hoverColor={`${props.color ?? primaryColor}30`}
        onClick={() => {
          props.onClick ? props.onClick() : setIsModalOpen(!isModalOpen);
        }}
        ref={props.Ref}
      >
        {React.createElement(props.icon, {
          color: props.color ?? primaryColor,
          size: NAVBAR_ICON_SIZE,
        })}
      </StyledTopbarActionButton>
      {props.modalComponent && (
        <Modal
          isOpen={isModalOpen}
          onOutsideClick={onOutsideModalClick}
          modalComponent={React.createElement(props.modalComponent, {
            onOutsideClick: onOutsideModalClick,
          })}
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
