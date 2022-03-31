import { Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import styled from "styled-components";
import AddMentorModal from "../components/pages/mentors/addMentorModal";
import Button from "../components/shared/button";
import DataGrid from "../components/shared/datagrid";
import Modal from "../components/shared/Modal";
import { HELP_MESSAGE } from "../constants/constants";
import { getMentorUsers } from "../api/backend/mentorUsers";
import { deleteUsers } from "../api/backend/users";
import OverlaySpinner from "../components/shared/overlaySpinner";

const Mentors: NextPage = () => {
  const [showAddMentorModal, setShowAddMentorModal] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [maxPageNum, setMaxPageNum] = useState(1);
  const [pageData, setPageData] = useState<
    {
      email: string;
      viewsPersonId: string;
    }[]
  >([]);
  const [dataGridKey, setDataGridKey] = useState<number>(1);
  const PAGE_LIMIT = 10;

  useEffect(() => {
    async function getData() {
      setLoadingData(true);
      const mentorsData = await getMentorUsers(
        PAGE_LIMIT,
        (pageNum - 1) * PAGE_LIMIT
      );

      if (mentorsData && mentorsData.data !== null) {
        setMaxPageNum(Math.ceil(mentorsData.total / PAGE_LIMIT));
        console.log(mentorsData);
        setPageData(
          mentorsData.data.map((mentorData) => ({
            email: mentorData.user.email,
            viewsPersonId: mentorData.viewsPersonId,
            id: mentorData.user.id,
          }))
        );
        setLoadingData(false);
      } else {
        toast.error(HELP_MESSAGE);
        setLoadingData(false);
      }
    }

    getData();
  }, [pageNum, dataGridKey]);

  return (
    <>
      <Paper>
        <Header>
          <Typography padding="0.75rem" variant="h4">
            Mentors
          </Typography>
          <Button
            variant="contained"
            style={{
              padding: "0.3rem 0.6rem 0.3rem 0.6rem",
              height: "fit-content",
              margin: "0.6rem 0.6rem 0 0",
            }}
            onClick={() => {
              setShowAddMentorModal(true);
            }}
          >
            <MdAdd size="2rem"></MdAdd>
            Add Mentor
          </Button>
        </Header>
        <DataGrid
          key={`${dataGridKey}`}
          data={pageData}
          cols={[
            {
              header: "Email",
              dataField: "email",
              dataType: "email",
            },
          ]}
          dataRowActions={[
            {
              name: "Delete",
              icon: MdDelete,
              action: async (dataRow: any) => {
                setLoadingData(true);
                const res = await deleteUsers(dataRow.id);
                setDataGridKey(dataGridKey + 1);
                if (res && res.status === 200) {
                  toast.success("Successfully deleted user!");
                } else {
                  toast.error(HELP_MESSAGE);
                }
                setLoadingData(false);
              },
            },
            {
              name: "Modify",
              icon: MdEdit,
              action: () => {
                alert("TODO: modify");
              },
            },
          ]}
        ></DataGrid>
      </Paper>
      <Modal
        isOpen={showAddMentorModal}
        onOutsideClick={() => {
          setShowAddMentorModal(false);
          setDataGridKey(dataGridKey + 1);
        }}
        modalComponent={AddMentorModal}
        height="100vh"
      ></Modal>
      <ToastContainer />
      <OverlaySpinner
        active={loadingData}
        onClick={() => {
          setLoadingData(false);
        }}
      ></OverlaySpinner>
    </>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default Mentors;
