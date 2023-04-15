import {
  Alert,
  Button,
  Checkbox,
  debounce,
  Grid,
  Icon,
  ListItemText,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { type ChangeEvent, useCallback } from 'react'
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md'
import type { OrderingDate } from '../../api/goals'
import { useGoalContext } from '../../context/GoalContext'
import { useGoalCategories } from '../../hooks/useGoalCategories'

const GoalCategoryFilter = () => {
  const { categories, loading, error } = useGoalCategories()
  const { query, handleChangeQuery } = useGoalContext()
  if (loading) return <Skeleton />
  if (error || categories.length === 0)
    return (
      <Alert severity="error" sx={{ width: '100%' }}>
        Please try again later
      </Alert>
    )

  const selectedIds = query.categoryIds || []

  return (
    <Select
      fullWidth
      multiple
      value={selectedIds}
      displayEmpty
      renderValue={(values) => {
        if (values.length === 0) return 'No categories selected'
        if (values.length === 1) return '1 categories selected'
        if (values.length === categories.length)
          return 'All categories selected'
        return `${values.length} categories selected`
      }}
      onChange={(e) => {
        const values = e.target.value as number[]
        handleChangeQuery((prev) => ({
          ...prev,
          offset: 0,
          categoryIds: values
        }))
      }}
    >
      {categories.map((category) => {
        return (
          <MenuItem value={category.id} key={`cat-${category.id}`}>
            <Checkbox
              checked={selectedIds.findIndex((id) => id === category.id) >= 0}
            />
            <ListItemText primary={category.name} />
          </MenuItem>
        )
      })}
    </Select>
  )
}

const GoalDateOrdering = () => {
  const { query, handleChangeQuery } = useGoalContext()
  return (
    <Stack direction="row" spacing={2}>
      <Select
        sx={{ flexGrow: 1 }}
        value={query.orderingDate || 'creation_date'}
        onChange={(ev) => {
          handleChangeQuery((prev) => ({
            ...prev,
            orderingDate: ev.target.value as OrderingDate
          }))
        }}
      >
        <MenuItem value="creation_date">Creation Date</MenuItem>
        <MenuItem value="goal_review_date">Review Date</MenuItem>
        <MenuItem value="last_update_date">Last Update</MenuItem>
      </Select>
      <Button
        onClick={() =>
          handleChangeQuery((prev) => ({
            ...prev,
            ascending: !prev.ascending
          }))
        }
        variant="outlined"
        startIcon={
          <Icon component={query.ascending ? MdArrowUpward : MdArrowDownward} />
        }
      >
        {query.ascending ? 'Ascending' : 'Descending'}
      </Button>
    </Stack>
  )
}

export const GoalSearch = () => {
  const { query, handleChangeQuery } = useGoalContext()
  const updateSearch = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleChangeQuery((prev) => ({
      ...prev,
      offset: 0,
      search: e.target.value
    }))
  }

  const debouncedSearch = useCallback(debounce(updateSearch, 500), [])

  return (
    <TextField
      fullWidth
      defaultValue={query.search || ''}
      onChange={debouncedSearch}
    />
  )
}

const GoalQuerying = () => {
  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} lg={4}>
        <Typography variant="subtitle1" component="div" gutterBottom>
          Search by title
        </Typography>
        <GoalSearch />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Typography variant="subtitle1" component="div" gutterBottom>
          Filter by categories
        </Typography>
        <GoalCategoryFilter />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Typography variant="subtitle1" component="div" gutterBottom>
          Sort by
        </Typography>
        <GoalDateOrdering />
      </Grid>
    </Grid>
  )
}

export default GoalQuerying
