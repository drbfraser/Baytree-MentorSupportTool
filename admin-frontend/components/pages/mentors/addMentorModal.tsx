import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  getVolunteersFromViews,
  Volunteer,
} from "../../../api/backend/views/volunteers";
import { HELP_MESSAGE } from "../../../constants/constants";
import DataGrid from "../../shared/datagrid";
import { ModalComponent } from "../../shared/Modal";
import Pager from "../../shared/pager";
import OverlaySpinner from "../../shared/overlaySpinner";
import { addMentorUser } from "../../../api/backend/mentorUsers";
import { addUsers } from "../../../api/backend/users";
import { MdCheck } from "react-icons/md";

const AddMentorModal: ModalComponent = (props) => {
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
                  const userRes = await addUsers({
                    first_name: dataRow.firstName,
                    last_name: dataRow.surName,
                    email: dataRow.email,
                    password: "testing",
                  });

                  if (userRes && userRes.ids) {
                    const mentorUserRes = await addMentorUser({
                      user: userRes.ids[0],
                      menteeUsers: [],
                      status: "Active",
                      viewsPersonId: dataRow.viewsPersonId,
                    });
                    if (mentorUserRes) {
                      setLoadingData(false);
                      toast.success("Sucessfully created Mentor User!");
                      props.onOutsideClick();
                    } else {
                      setLoadingData(false);
                      toast.error(HELP_MESSAGE);
                    }
                  } else {
                    setLoadingData(false);
                    toast.error(HELP_MESSAGE);
                  }
                },
                name: "Create",
                icon: MdCheck,
              },
            ]}
          ></DataGrid>
          <Pager
            onNextPagePressed={setPageNumber}
            onPreviousPagePressed={setPageNumber}
            onGotoPagePressed={setPageNumber}
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
