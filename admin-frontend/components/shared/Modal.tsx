import { Button } from "@mui/material";
import React, { useEffect, useRef } from "react";
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
  modalComponent: ModalComponent;
  width?: string;
  height?: string;
  enableCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = (props) => {
  const onMobileDevice = useMobileLayout();
  const modalElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        !onMobileDevice &&
        modalElementRef.current &&
        !modalElementRef.current.contains(event.target as Node) &&
        (document.getElementsByClassName("Toastify").length == 0 ||
          !document
            .getElementsByClassName("Toastify")[0]
            .contains(event.target as Node))
      ) {
        props.onOutsideClick();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return props.isOpen
    ? ReactDOM.createPortal(
        <Overlay>
          <div></div>
          <StyledModal
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
            {React.createElement(props.modalComponent, {
              onOutsideClick: props.onOutsideClick,
              useMobileLayout: onMobileDevice,
            })}
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
  width: ${(props) =>
    props.useMobileLayout ? "100vw" : props.width ?? "60vw"};
  height: ${(props) =>
    props.useMobileLayout ? "100vh" : props.height ?? "60vh"};
  top: ${(props) =>
    props.useMobileLayout
      ? "0"
      : props.height &&
        props.height !== "auto" &&
        props.height !== "fit-content"
      ? `calc((100vh - ${props.height}) / 2)`
      : "20vh"};
  left: ${(props) =>
    props.useMobileLayout
      ? "0"
      : props.width
      ? `calc((100vw - ${props.width}) / 2)`
      : "20vw"};
  z-index: 501;
  padding: 2rem;
  overflow-y: auto;
`;

export default Modal;
