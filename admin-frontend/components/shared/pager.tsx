import { TextField, Typography } from "@mui/material";
import React, { useRef } from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import useMobileLayout from "../../hooks/useMobileLayout";
import Button from "./button";

export interface PagerProps {
  onNextPagePressed: (nextPageNumber: number) => void;
  onPreviousPagePressed: (prevPageNumber: number) => void;
  onGotoPagePressed: (gotoPageNumber: number) => void;
  currentPageNumber: number;
  maxPageNumber: number;
}

const Pager: React.FC<PagerProps> = (props) => {
  const onMobileDevice = useMobileLayout();
  const currentPageNumberInputRef = useRef<HTMLInputElement>(null);

  const renderPageNumberPicker = () => {
    return (
      <>
        <div
          style={{
            margin: "0 1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>Page Number:</Typography>
        </div>
        <TextField
          inputRef={currentPageNumberInputRef}
          margin="normal"
          placeholder={`${props.currentPageNumber}`}
        />
        <div
          style={{
            margin: "0 1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>of {props.maxPageNumber}</Typography>
        </div>
        <Button
          style={{
            padding: "1.2rem 1rem",
            height: "fit-content",
            margin: "0.6rem 0.6rem 0px 0px",
          }}
          variant="contained"
          onClick={() => {
            if (currentPageNumberInputRef.current) {
              const parsedCurrentPageNumber = parseInt(
                currentPageNumberInputRef.current.value
              );

              if (parsedCurrentPageNumber) {
                if (
                  parsedCurrentPageNumber < 1 ||
                  parsedCurrentPageNumber > props.maxPageNumber
                ) {
                  toast(
                    `Page number must be between 1 and ${props.maxPageNumber}`
                  );
                } else {
                  props.onGotoPagePressed(parsedCurrentPageNumber);
                }
              } else {
                toast(
                  `Page number must be between 1 and ${props.maxPageNumber}`
                );
              }
            }
          }}
        >
          Go
        </Button>
      </>
    );
  };

  return (
    <>
      <div style={{ width: "100%", justifyContent: "center", display: "flex" }}>
        <ToastContainer></ToastContainer>
        <Button
          style={{
            padding: "0.5rem 0.6rem",
            height: "fit-content",
            margin: "0.6rem 0.6rem 0px 0px",
          }}
          variant="contained"
          disabled={props.currentPageNumber <= 1}
          onClick={() => {
            if (currentPageNumberInputRef.current) {
              currentPageNumberInputRef.current.value = "";
              if (props.currentPageNumber > 1) {
                props.onNextPagePressed(props.currentPageNumber - 1);
              } else {
                toast("There are no more previous pages!");
              }
            }
          }}
        >
          <MdArrowLeft size="3rem"></MdArrowLeft>
        </Button>
        <Button
          style={{
            padding: "0.5rem 0.6rem",
            height: "fit-content",
            margin: "0.6rem 0.6rem 0px 0px",
          }}
          variant="contained"
          disabled={props.currentPageNumber >= props.maxPageNumber}
          onClick={() => {
            if (currentPageNumberInputRef.current) {
              currentPageNumberInputRef.current.value = "";
            }
            if (props.currentPageNumber < props.maxPageNumber) {
              props.onNextPagePressed(props.currentPageNumber + 1);
            } else {
              toast("There are no more pages left!");
            }
          }}
        >
          <MdArrowRight size="3rem"></MdArrowRight>
        </Button>
        {!onMobileDevice && renderPageNumberPicker()}
      </div>
      {onMobileDevice && (
        <div
          style={{ width: "100%", justifyContent: "center", display: "flex" }}
        >
          {renderPageNumberPicker()}
        </div>
      )}
    </>
  );
};

export default Pager;
