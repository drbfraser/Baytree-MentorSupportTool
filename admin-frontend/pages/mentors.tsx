import { Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";
import { MdAdd } from "react-icons/md";
import styled from "styled-components";
import AddMentorModal from "../components/pages/mentors/addMentorModal";
import Button from "../components/shared/button";
import Modal from "../components/shared/Modal";
import { getMentorUsers } from "../api/backend/mentorUsers";
import { deleteUsers } from "../api/backend/users";
import DataGrid, {
  onLoadDataRowsFunc,
  onSaveDataRowsFunc,
} from "../components/shared/datagrid/datagrid";

const Mentors: NextPage = () => {
  const [showAddMentorModal, setShowAddMentorModal] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [dataGridKey, setDataGridKey] = useState<number>(1);
  const PAGE_LIMIT = 10;

  const loadMentorUserDataRows: onLoadDataRowsFunc = async () => {
    const mentorsData = await getMentorUsers();
    if (mentorsData && mentorsData.data !== null) {
      return mentorsData.data.map((mentor) => ({
        id: mentor.user.id,
        email: mentor.user.email,
      }));
    } else {
      throw "Failed to get mentor user data";
    }
  };

  const saveMentorUserDataRows: onSaveDataRowsFunc = async (
    createRows,
    updateRows,
    deleteRows
  ) => {
    const res = await deleteUsers(deleteRows.map((row) => row.id));

    if (res) {
      return res.status === 200;
    } else {
      return false;
    }
  };

  return (
    <>
      <Paper>
        <Header>
          <Typography padding="0.75rem" variant="h5">
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
          onLoadDataRows={loadMentorUserDataRows}
          onSaveDataRows={saveMentorUserDataRows}
          cols={[
            {
              header: "Email",
              dataField: "email",
              disableEditing: true,
            },
          ]}
          disableDataRowCreation
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
    </>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default Mentors;
