import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { ReactText, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useRecords from "../../hooks/useRecords";
import Loading from "../shared/Loading";
import RecordDetail from "./RecordDetail";
import RecordRow from "./RecordRow";

const PAGNINATE_OPTIONS = [5, 10, 20];

export default function Records() {
  // Records and pagniation
  const [query, setQuery] = useState({
    page: 0,
    limit: PAGNINATE_OPTIONS[0],
    descending: true,
  });
  const { count, sessions, loading, error } = useRecords(query);

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setQuery((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setQuery((prev) => ({ ...prev, page: 0, limit: +event.target.value }))
  };

  const toggleOrdering = () => {
    setQuery((prev) => ({ ...prev, descending: !prev.descending }))
  }

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
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h4" component="h2">
          Records
        </Typography>
        <Button
          onClick={toggleOrdering}
          startIcon={query.descending ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}>
          {query.descending ? "Newest to oldest" : "Oldest to newest"}
        </Button>
      </Box>
      <Paper>
        <TableContainer sx={{ overflow: "auto" }}>
          <Table sx={{ minWidth: 650, maxHeight: 440 }}>
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

          </Table>
        </TableContainer>
        <TablePagination
          colSpan={5}
          rowsPerPageOptions={PAGNINATE_OPTIONS}
          rowsPerPage={query.limit}
          component="div"
          count={count}
          page={query.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage} />
      </Paper>
      <RecordDetail sessionId={sessionId} open={open} handleClose={() => setOpen(false)} />
    </>
  );
}
