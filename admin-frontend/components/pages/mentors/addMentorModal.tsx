import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getVolunteersFromViews,
  Volunteer,
} from "../../../api/backend/views/volunteers";
import { HELP_MESSAGE } from "../../../constants/constants";
import DataGrid, {
  onLoadPagedDataRowsFunc,
} from "../../shared/datagrid/datagrid";
import { ModalComponent } from "../../shared/Modal";
import OverlaySpinner from "../../shared/overlaySpinner";
import { sendMentorAccountCreationEmail } from "../../../api/backend/mentorUsers";
import { MdCheck } from "react-icons/md";
import styled from "styled-components";

const AddMentorModal: ModalComponent = (props) => {
  const [isSendingMentorEmail, setIsSendingMentorEmail] = useState(false);
  const PAGE_LIMIT = 5;

  const getVolunteerDataRows: onLoadPagedDataRowsFunc = async ({
    searchText,
    limit,
    offset,
  }) => {
    const mentorsData = await getVolunteersFromViews(limit, offset, {
      searchEmail: searchText,
    });

    if (mentorsData && mentorsData.data !== null) {
      return {
        count: mentorsData.total,
        results: mentorsData.data,
      };
    } else {
      throw HELP_MESSAGE;
    }
  };

  return (
    <>
      <OverlaySpinner
        active={isSendingMentorEmail}
        onClick={() => {
          setIsSendingMentorEmail(false);
        }}
      ></OverlaySpinner>
      <DataGridContainer>
        <DataGrid
          onLoadDataRows={getVolunteerDataRows}
          cols={[
            {
              header: "Email",
              dataField: "email",
              enableSearching: true,
            },
            { header: "First Name", dataField: "firstname" },
            { header: "Last Name", dataField: "surname" },
          ]}
          dataRowActions={[
            {
              actionFunction: async (dataRow) => {
                setIsSendingMentorEmail(true);

                if (!dataRow.email) {
                  setIsSendingMentorEmail(false);
                  toast.error("Error: user doesn't have valid email in views!");
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
                  toast.success(
                    "Email has been sent to mentor for account creation."
                  );
                  props.onOutsideClick();
                } else {
                  toast.error(
                    "Failed to send account creation email to mentor."
                  );
                  props.onOutsideClick();
                }
                setIsSendingMentorEmail(false);
              },
              name: "Create",
              icon: <MdCheck />,
            },
          ]}
          isDataGridDeleteable={false}
          pageSize={PAGE_LIMIT}
        ></DataGrid>
      </DataGridContainer>
    </>
  );
};

const DataGridContainer = styled.div`
  margin-top: 2rem;
`;

export default AddMentorModal;
