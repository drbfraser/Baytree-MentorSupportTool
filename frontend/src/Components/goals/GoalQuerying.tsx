import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Alert, Button, Checkbox, Grid, ListItemText, MenuItem, Select, Skeleton, Stack, Typography } from "@mui/material";
import { OrderBy } from "../../api/goals";
import { useGoals } from "../../context/GoalContext";
import { useGoalCategories } from "../../hooks/useGoalCategories";

const GoalCateogoryFilter = () => {
  const { categories, loading, error } = useGoalCategories();
  const { query, handleChangeQuery } = useGoals();
  if (loading) return <Skeleton />;
  if (error || categories.length === 0)
    return <Alert severity="error" sx={{ width: "100%" }}>Please try again later</Alert>;

  const selectedIds = query.categoryIds || [];

  return <Select fullWidth multiple value={selectedIds} displayEmpty
    renderValue={(values) => {
      if (values.length === 0) return "No categories selected";
      if (values.length === 1) return "1 categories selected";
      if (values.length === categories.length) return "All categories selected";
      return `${values.length} categories selected`;
    }}
    onChange={(e) => {
      const values = e.target.value as number[];
      handleChangeQuery(prev => ({
        ...prev,
        offset: 0,
        categoryIds: values
      }))
    }}>
    {categories.map(category => {
      return <MenuItem value={category.id} key={`cat-${category.id}`}>
        <Checkbox checked={selectedIds.findIndex(id => id === category.id) >= 0} />
        <ListItemText primary={category.name} />
      </MenuItem>
    }
    )}
  </Select>
}

const GoalDateOrdering = () => {
  const { query, handleChangeQuery } = useGoals();
  return <Stack direction="row" spacing={2}>
    <Select sx={{ flexGrow: 1 }} value={query.orderBy || "creation_date"} onChange={(ev) => {
      handleChangeQuery(prev => ({
        ...prev,
        orderBy: ev.target.value as OrderBy
      }))
    }}>
      <MenuItem value="creation_date">Creation Date</MenuItem>
      <MenuItem value="goal_review_date">Review Date</MenuItem>
      <MenuItem value="last_update_date">Last Update</MenuItem>
    </Select>
    <Button
      onClick={() => handleChangeQuery(prev => ({
        ...prev,
        ascending: !prev.ascending
      }))}
      variant="outlined"
      startIcon={query.ascending ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}>
      {query.ascending ? "Ascending" : "Descending"}
    </Button>
  </Stack>
}

const GoalQuerying = () => {
  return <Grid container spacing={2} sx={{ mt: 2 }}>
    <Grid item xs={12} lg={7}>
      <Typography variant="subtitle1" component="div" gutterBottom>Filter by categories</Typography>
      <GoalCateogoryFilter />
    </Grid>
    <Grid item xs={12} lg={5}>
      <Typography variant="subtitle1" component="div" gutterBottom>Sort by</Typography>
      <GoalDateOrdering />
    </Grid>
  </Grid>
}

export default GoalQuerying;