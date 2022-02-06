import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

export type ModalComponent = React.FC<{
  onOutsideClick: () => void;
  useMobileLayout?: boolean;
}>;

interface ModalProps {
  isOpen: boolean;
  onOutsideClick: () => void;
  modalComponent: ModalComponent;
  useMobileLayout?: boolean;
  width?: string;
  height?: string;
}

const Modal: React.FC<ModalProps> = (props) => {
  const modalElementRef = useRef<HTMLDivElement>(null);
  const useMobileLayoutRef = useRef(props.useMobileLayout);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        !useMobileLayoutRef.current &&
        modalElementRef.current &&
        !modalElementRef.current.contains(event.target as Node)
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
            useMobileLayout={props.useMobileLayout}
          >
            {React.createElement(props.modalComponent, {
              onOutsideClick: props.onOutsideClick,
              useMobileLayout: props.useMobileLayout,
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
  top: ${(props) => (props.useMobileLayout ? "0" : "20vh")};
  left: ${(props) => (props.useMobileLayout ? "0" : "20vw")};
  z-index: 501;
  padding: 2rem;
`;

export default Modal;
