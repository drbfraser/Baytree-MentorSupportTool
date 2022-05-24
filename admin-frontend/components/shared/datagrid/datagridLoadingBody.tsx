import { Skeleton, TableCell, TableRow } from "@mui/material";
import { FC } from "react";

const DataGridLoadingBody: FC<DataGridLoadingBodyProps> = (props) => {
  const NUM_SKELETON_ROWS = 5;

  return (
    <>
      {Array.from(Array(NUM_SKELETON_ROWS).keys()).map((idx) => (
        <TableRow key={idx}>
          <TableCell colSpan={props.numCols}>
            <Skeleton></Skeleton>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

interface DataGridLoadingBodyProps {
  numCols: number;
}

export default DataGridLoadingBody;
