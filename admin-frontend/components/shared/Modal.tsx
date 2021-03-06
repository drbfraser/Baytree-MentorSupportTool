import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { MdClose } from "react-icons/md";
import styled from "styled-components";
import useMobileLayout from "../../hooks/useMobileLayout";

export type ModalComponent = React.FC<{
  onOutsideClick: () => void;
  useMobileLayout?: boolean;
}>;
interface ModalProps {
  isOpen: boolean;
  onOutsideClick: () => void;
  modalComponent: React.ReactElement;
  width?: string;
  height?: string;
  enableCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = (props) => {
  const modalElementRef = useRef<HTMLDivElement>(null);
  const onMobileDevice = useMobileLayout();
  const onMobileDeviceRef = useRef(false);

  useEffect(() => {
    const isOnMobileDevice = onMobileDeviceRef.current;

    function handleClickOutside(event: MouseEvent) {
      const clickedTargetElementNotInsideModal =
        modalElementRef.current &&
        !modalElementRef.current.contains(event.target as Node);

      const didClickOutsideModal =
        (!isOnMobileDevice &&
          clickedTargetElementNotInsideModal &&
          notClickedOnToastifyMessage(event) &&
          notClickedOnPopoverOptionInModal(event) &&
          !clickedOnAnotherModal(modalElementRef.current, event)) ||
        clickedOnOverlay(event);

      if (didClickOutsideModal) {
        props.onOutsideClick();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    onMobileDeviceRef.current = onMobileDevice;
  }, [onMobileDevice]);

  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  });

  return props.isOpen
    ? ReactDOM.createPortal(
        <Overlay id="ModalOverlay">
          <div></div>
          <StyledModal
            id={"Modal"}
            ref={modalElementRef}
            width={props.width}
            height={props.height}
            useMobileLayout={onMobileDevice}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {props.enableCloseButton !== false && (
                <Button
                  variant="contained"
                  color="error"
                  style={{
                    padding: "0.3rem 0.6rem 0.3rem 0.6rem",
                    height: "fit-content",
                    margin: "0.6rem 0.6rem 0 0",
                  }}
                  onClick={() => props.onOutsideClick()}
                >
                  <MdClose size="2rem"></MdClose>
                  Close
                </Button>
              )}
            </div>
            {props.modalComponent}
          </StyledModal>
        </Overlay>,
        document.getElementById("modalContainer") as HTMLElement
      )
    : null;
};

const Overlay = styled.div`
  background: #00000050;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 500;
`;

interface StyledModalProps {
  width?: string;
  height?: string;
  useMobileLayout?: boolean;
}

const StyledModal = styled.div<StyledModalProps>`
  position: fixed;
  background: white;
  border-radius: 12px;
  width: ${(props) =>
    props.useMobileLayout ? "100vw" : props.width ?? "80vw"};
  height: ${(props) =>
    props.useMobileLayout ? "100vh" : props.height ?? "80vh"};
  top: ${(props) =>
    props.useMobileLayout
      ? "0"
      : props.height &&
        props.height !== "auto" &&
        props.height !== "fit-content"
      ? `calc((100vh - ${props.height}) / 2)`
      : "10vh"};
  left: ${(props) =>
    props.useMobileLayout
      ? "0"
      : props.width
      ? `calc((100vw - ${props.width}) / 2)`
      : "10vw"};
  z-index: 501;
  padding: 2rem;
  overflow-y: auto;
`;

export default Modal;

function notClickedOnToastifyMessage(event: MouseEvent) {
  return (
    document.getElementsByClassName("Toastify").length == 0 ||
    !document
      .getElementsByClassName("Toastify")[0]
      .contains(event.target as Node)
  );
}

function notClickedOnPopoverOptionInModal(event: MouseEvent) {
  return (
    document.getElementsByClassName("MuiPopover-root").length == 0 ||
    !document
      .getElementsByClassName("MuiPopover-root")[0]
      .contains(event.target as Node)
  );
}

function clickedOnOverlay(event: MouseEvent): boolean | null {
  return (event.target as any).id === "ModalOverlay";
}

function clickedOnAnotherModal(
  modalElement: HTMLDivElement,
  event: MouseEvent
): boolean {
  let currentPar = event.target as any;
  while (currentPar && !currentPar.id.includes("Modal")) {
    currentPar = currentPar.parentElement;
  }
  return currentPar && currentPar !== modalElement;
}
