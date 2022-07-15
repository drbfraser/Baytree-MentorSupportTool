import { Alert, AlertTitle, Box, TablePagination, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { Goal } from "../../api/goals";
import { PAGINATION_OPTIONS, useGoals } from "../../context/GoalContext";
import Loading from "../shared/Loading";
import GoalListItem from "./GoalListItem";

type Props = {
  openDialog: (goal?: Goal) => void;
}

const GoalsList: FunctionComponent<Props> = ({ openDialog }) => {
  const {loadingGoals, error, goals, params, statistics, handleChangeParams} = useGoals();
  const {active, complete} = statistics;
  const count = params.active ? active
    : params.completed ? complete : (active + complete);

  if (loadingGoals) return <Loading />;
  if (error) return <Alert>
    <AlertTitle>{error}</AlertTitle>
    Please refresh the page or contact the adminstrators.
  </Alert>
  
  if (goals.length === 0)
    return <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>No goals found</Typography>

  const [selected, setSelected] = useState<number | undefined>(undefined);

  return <Box sx={{ mt: 3 }}>
    {goals.map(goal => {
      return <GoalListItem
        goal={goal}
        key={goal.id}
        expanded={selected === goal.id}
        handleClick={() => setSelected(selected === goal.id ? undefined : goal.id)}
        handleEdit={() => openDialog(goal)} />
    })}
    <TablePagination 
      count={count} 
      rowsPerPage={params.limit}
      rowsPerPageOptions={PAGINATION_OPTIONS}
      page={params.offset / params.limit} 
      component="div"
      onRowsPerPageChange={(e) => {
        handleChangeParams(prev => ({
          ...prev,
          limit: +e.target.value,
          offset: 0
        }))
      }}
      onPageChange={(_, page) => handleChangeParams(prev => ({
        ...prev,
        offset: prev.limit * page
      }))}  />
  </Box>
}

export default GoalsList;