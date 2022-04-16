import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getVolunteersFromViews,
  Volunteer,
} from "../../../api/backend/views/volunteers";
import { HELP_MESSAGE } from "../../../constants/constants";
import DataGrid from "../../shared/datagrid";
import Pager from "../../shared/pager";
import OverlaySpinner from "../../shared/overlaySpinner";
import { sendMentorAccountCreationEmail } from "../../../api/backend/mentorUsers";
import { MdCheck, MdSearch } from "react-icons/md";
import { IconButton, InputAdornment, TextField } from "@mui/material";

interface AddMentorModalProps {
  onOutsideClick: () => void;
}

const AddMentorModal: React.FC<AddMentorModalProps> = (props) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [maxPageNumber, setMaxPageNumber] = useState(1);
  const [pageData, setPageData] = useState<Volunteer[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const PAGE_LIMIT = 6;

  const getPageData = async (pageNumberOverride?: number) => {
    setLoadingData(true);
    const mentorsData = await getVolunteersFromViews(
      PAGE_LIMIT,
      (pageNumberOverride ? pageNumberOverride - 1 : pageNumber - 1) *
        PAGE_LIMIT,
      { searchEmail: emailFilter }
    );

    if (mentorsData && mentorsData.data !== null) {
      setMaxPageNumber(Math.ceil(mentorsData.total / PAGE_LIMIT));
      setPageData(mentorsData.data);
      setLoadingData(false);
    } else {
      toast.error(HELP_MESSAGE);
      setLoadingData(false);
    }
  };

  useEffect(() => {
    getPageData(1);
    setPageNumber(1);
  }, []);

  // Use to tell if useEffect is being called on first mount of add mentor
  // to prevent getting data from backend on mount and update (twice unnecessary)
  const isMountSideEffect = useRef(true);
  useEffect(() => {
    if (!isMountSideEffect.current) {
      // Use timeouts to debounce input so no backend call per character
      clearTimeout(delayTimerRef.current as number);
      delayTimerRef.current = setTimeout(function () {
        getPageData(1);
        setPageNumber(1);
      }, 1000);
    }

    isMountSideEffect.current = false;
  }, [emailFilter]);

  const delayTimerRef = useRef<NodeJS.Timeout | number | undefined>(undefined);

  return (
    <div>
      {loadingData ? (
        <OverlaySpinner
          active={loadingData}
          onClick={() => {
            setLoadingData(false);
          }}
        ></OverlaySpinner>
      ) : (
        <>
          <TextField
            margin="normal"
            fullWidth
            name="emailFilter"
            label="Search by Email"
            type="emailFilter"
            id="emailFilter"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <MdSearch />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <DataGrid
            data={pageData}
            cols={[
              {
                header: "Email",
                dataField: "email",
                dataType: "email",
                keepOnMobile: true,
              },
              { header: "First Name", dataField: "firstname" },
              { header: "Last Name", dataField: "surname" },
            ]}
            dataRowActions={[
              {
                action: async (dataRow) => {
                  setLoadingData(true);
                  if (!dataRow.email) {
                    setLoadingData(false);
                    toast.error(
                      "Error: user doesn't have valid email in views!"
                    );
                    return;
                  }

                  const sendAccountCreationEmailRes =
                    await sendMentorAccountCreationEmail(
                      dataRow.viewsPersonId,
                      dataRow.firstname,
                      dataRow.email
                    );

                  if (
                    sendAccountCreationEmailRes &&
                    sendAccountCreationEmailRes.status === 200
                  ) {
                    setLoadingData(false);
                    toast.success(
                      "Email has been sent to mentor for account creation."
                    );
                    props.onOutsideClick();
                  } else {
                    setLoadingData(false);
                    toast.error(
                      "Failed to send account creation email to mentor."
                    );
                    props.onOutsideClick();
                  }
                },
                name: "Create",
                icon: MdCheck,
              },
            ]}
          ></DataGrid>
          <Pager
            onChangePage={(num: number) => {
              getPageData(num);
              setPageNumber(num);
            }}
            maxPageNumber={maxPageNumber}
            currentPageNumber={pageNumber}
          ></Pager>
        </>
      )}
    </div>
  );
};

export default AddMentorModal;
