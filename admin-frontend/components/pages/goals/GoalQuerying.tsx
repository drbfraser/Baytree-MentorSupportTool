import { Button, Checkbox, ListItemText, MenuItem, Select, Skeleton, Stack } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { toast } from "react-toastify";
import { backendGet } from "../../../api/backend/base";
import { GoalCategory, GoalQuery, OrderingDate } from "../../../api/backend/goals";

type Props = {
  query: GoalQuery;
  handleChangeQuery: (fn: (prev: GoalQuery) => GoalQuery) => void;
}

export const GoalCateogoryFilter: FunctionComponent<Props> = ({ query, handleChangeQuery }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([] as GoalCategory[]);

  useEffect(() => {
    backendGet<GoalCategory[]>("goals/categories/").then(data => {
      if (data) setCategories(data);
    }).catch(() => {
      toast.error("Cannot fetch the goal cateogies. Please refresh the page");
    }).finally(() => setLoading(false));

    return () => toast.dismiss();
  }, [])

  if (loading) return <Skeleton />;
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

export const GoalDateOrdering: FunctionComponent<Props> = ({ query, handleChangeQuery }) => {
  return <Stack direction="row" spacing={2}>
    <Select sx={{ flexGrow: 1 }} value={query.orderingDate || "creation_date"} onChange={(ev) => {
      handleChangeQuery(prev => ({
        ...prev,
        orderingDate: ev.target.value as OrderingDate
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
      startIcon={query.ascending ? <MdArrowUpward /> : <MdArrowDownward />}>
      {query.ascending ? "Ascending" : "Descending"}
    </Button>
  </Stack>
}