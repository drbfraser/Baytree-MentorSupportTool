import { Button, TextField, Tooltip, Typography } from "@mui/material";
import React, { MutableRefObject, useEffect, useRef } from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import { toast } from "react-toastify";
import useMobileLayout from "../../hooks/useMobileLayout";

export interface PagerProps {
  onChangePage: (newPage: number) => void;
  currentPageNumber: number;
  maxPageNumber: number;
  clearPagerFuncRef?: MutableRefObject<(() => void) | null>;
}

const Pager: React.FC<PagerProps> = (props) => {
  const onMobileDevice = useMobileLayout();
  const currentPageNumberInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.clearPagerFuncRef) {
      props.clearPagerFuncRef.current = () => {
        if (currentPageNumberInputRef.current) {
          currentPageNumberInputRef.current.value = "";
        }
      };
    }
  }, [currentPageNumberInputRef.current]);

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
          style={{ maxWidth: "6rem" }}
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
        <Tooltip title="Go To Page Number">
          <Button
            style={{
              padding: "0.8rem 0.6rem",
              height: "fit-content",
              margin: "0.6rem 0.6rem 0px 0px",
            }}
            color="success"
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
                    toast.error(
                      `Page number must be between 1 and ${props.maxPageNumber}`
                    );
                  } else {
                    props.onChangePage(parsedCurrentPageNumber);
                  }
                } else {
                  toast.error(
                    `Page number must be between 1 and ${props.maxPageNumber}`
                  );
                }
              }
            }}
          >
            Go
          </Button>
        </Tooltip>
      </>
    );
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Tooltip title="Previous Page">
          <Button
            style={{
              padding: "0 0.6rem",
              height: "fit-content",
              margin: "0.6rem 0.6rem 0px 0px",
            }}
            color="success"
            variant="contained"
            disabled={props.currentPageNumber <= 1}
            onClick={() => {
              if (currentPageNumberInputRef.current) {
                currentPageNumberInputRef.current.value = "";
                if (props.currentPageNumber > 1) {
                  props.onChangePage(props.currentPageNumber - 1);
                } else {
                  toast.error("There are no more previous pages!");
                }
              }
            }}
          >
            <MdArrowLeft size="3rem"></MdArrowLeft>
          </Button>
        </Tooltip>
        <Tooltip title="Next Page">
          <Button
            style={{
              padding: "0 0.6rem",
              height: "fit-content",
              margin: "0.6rem 0.6rem 0px 0px",
            }}
            color="success"
            variant="contained"
            disabled={props.currentPageNumber >= props.maxPageNumber}
            onClick={() => {
              if (currentPageNumberInputRef.current) {
                currentPageNumberInputRef.current.value = "";
              }
              if (props.currentPageNumber < props.maxPageNumber) {
                props.onChangePage(props.currentPageNumber + 1);
              } else {
                toast.error("There are no more pages left!");
              }
            }}
          >
            <MdArrowRight size="3rem"></MdArrowRight>
          </Button>
        </Tooltip>
        {!onMobileDevice && renderPageNumberPicker()}
      </div>
      {onMobileDevice && (
        <div
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {renderPageNumberPicker()}
        </div>
      )}
    </>
  );
};

export default Pager;
