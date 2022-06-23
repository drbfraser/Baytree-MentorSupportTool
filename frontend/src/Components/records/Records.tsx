import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { ReactText, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useRecords from "../../hooks/useRecords";
import Loading from "../shared/Loading";
import RecordDetail from "./RecordDetail";
import RecordRow from "./RecordRow";

const PAGNINATE_OPTIONS = [2, 5, 10, 20];

export default function Records() {
  // Records and pagniation
  const [query, setQuery] = useState({
    page: 0,
    limit: PAGNINATE_OPTIONS[0]
  });

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setQuery((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setQuery({ page: 0, limit: +event.target.value })
  };

  const { count, sessions, loading, error } = useRecords(query);

  // Record dialog
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | number | undefined>(undefined);

  // Give the error toast when failure
  useEffect(() => {
    let toastId: ReactText;
    if (error) toastId = toast.error(error);
    return () => {
      if (toastId) toast.dismiss(toastId);
    }
  }, [error]);

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Records
      </Typography>
      <TableContainer component={Paper} sx={{ overflow: "auto" }}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Session Title</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <TableRow>
              <TableCell colSpan={5}><Loading /></TableCell>
            </TableRow>}
            {sessions.length === 0 && !loading && <TableRow>
              <TableCell colSpan={5} align="center">No records found</TableCell>
            </TableRow>}
            {!loading && sessions.map(session => {
              return <RecordRow
                session={session}
                key={session.viewsSessionId}
                handleClick={() => {
                  setSessionId(session.viewsSessionId);
                  setOpen(true);
                }} />
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={5}
                rowsPerPageOptions={PAGNINATE_OPTIONS}
                rowsPerPage={query.limit}
                count={count}
                page={query.page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <RecordDetail sessionId={sessionId} open={open} handleClose={() => setOpen(false)} />
    </>
  );
}
