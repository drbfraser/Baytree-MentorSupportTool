import { Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import { MdAdd, MdDelete } from "react-icons/md";
import styled from "styled-components";
import Button from "../components/shared/button";
import PageableDataGrid from "../components/shared/datagrid";

const Mentors: NextPage = () => {
  return (
    <Paper>
      <Header>
        <Typography padding="0.75rem" variant="h4">
          Mentors
        </Typography>
        <Button variant="contained" style={{margin: "0.6rem 0.6rem 0 0"}}>
          <MdAdd size="2rem"></MdAdd>
          Add Mentor
        </Button>
      </Header>
      <PageableDataGrid
        data={[
          { fruit: "Apple", rating: "Dabest" },
          { fruit: "Orange", rating: "Ok" },
        ]}
        cols={[
          { header: "Fruit", dataField: "fruit", dataType: "string" },
          { header: "Rating", dataField: "rating", dataType: "rating" },
        ]}
        dataRowActions={[
          {
            name: "Delete",
            icon: MdDelete,
            action: () => {
              alert("Deleting fruit");
            },
          },
          {
            name: "Delete",
            icon: MdDelete,
            action: () => {
              alert("Deleting fruit");
            },
          },
        ]}
      ></PageableDataGrid>
    </Paper>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default Mentors;
