import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  getVolunteersFromViews,
  Volunteer,
} from "../../../api/backend/views/volunteers";
import { HELP_MESSAGE } from "../../../constants/constants";
import DataGrid from "../../shared/datagrid";
import Pager from "../../shared/pager";
import OverlaySpinner from "../../shared/overlaySpinner";
import { sendMentorAccountCreationEmail } from "../../../api/backend/mentorUsers";
import { MdCheck } from "react-icons/md";

interface AddMentorModalProps {
  onOutsideClick: () => void;
}

const AddMentorModal: React.FC<AddMentorModalProps> = (props) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [maxPageNumber, setMaxPageNumber] = useState(1);
  const [pageData, setPageData] = useState<Volunteer[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const PAGE_LIMIT = 8;

  useEffect(() => {
    async function getData() {
      setLoadingData(true);
      const mentorsData = await getVolunteersFromViews(
        PAGE_LIMIT,
        (pageNumber - 1) * PAGE_LIMIT
      );

      if (mentorsData && mentorsData.data !== null) {
        setMaxPageNumber(Math.ceil(mentorsData.total / PAGE_LIMIT));
        setPageData(mentorsData.data);
        setLoadingData(false);
      } else {
        toast.error(HELP_MESSAGE);
        setLoadingData(false);
      }
    }

    getData();
  }, [pageNumber]);

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
          <DataGrid
            data={pageData}
            cols={[
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
            onChangePage={setPageNumber}
            maxPageNumber={maxPageNumber}
            currentPageNumber={pageNumber}
          ></Pager>
          <ToastContainer></ToastContainer>
        </>
      )}
    </div>
  );
};

export default AddMentorModal;
