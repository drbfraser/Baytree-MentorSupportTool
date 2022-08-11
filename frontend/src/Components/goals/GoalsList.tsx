import { Alert, AlertTitle, Box, TablePagination, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { Goal, GoalDetail } from "../../api/goals";
import { PAGINATION_OPTIONS, useGoalContext } from "../../context/GoalContext";
import Loading from "../shared/Loading";
import GoalListItem from "./GoalListItem";

const GoalsList = () => {
  const { loadingGoals, error, goals, query, handleChangeQuery, count } = useGoalContext();
  const [selected, setSelected] = useState<number | undefined>(undefined);

  if (loadingGoals) return <Loading />;
  if (error) return <Alert sx={{ mt: 3 }} severity="error">
    <AlertTitle>{error}</AlertTitle>
    Please refresh the page or contact the adminstrators.
  </Alert>

  if (goals.length === 0)
    return <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>No goals found</Typography>

  return <Box sx={{ mt: 3 }}>
    {goals.map((goal) => {
      return <GoalListItem
        goal={goal}
        key={goal.id}
        expanded={selected === goal.id}
        handleClick={() => setSelected(selected === goal.id ? undefined : goal.id)} />
    })}
    <TablePagination
      count={count}
      rowsPerPage={query.limit}
      rowsPerPageOptions={PAGINATION_OPTIONS}
      page={query.offset / query.limit}
      component="div"
      onRowsPerPageChange={(e) => {
        handleChangeQuery(prev => ({
          ...prev,
          limit: +e.target.value,
          offset: 0
        }))
      }}
      onPageChange={(_, page) => handleChangeQuery(prev => ({
        ...prev,
        offset: prev.limit * page
      }))} />
  </Box>
}

export default GoalsList;