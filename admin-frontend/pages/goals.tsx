import {
  Alert,
  AlertTitle,
  Grid,
  TablePagination,
  Typography
} from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { NextPage } from 'next'
import { SyntheticEvent, useState } from 'react'
import { Goal } from '../api/backend/goals'
import GoalExportButton from '../components/pages/goals/GoalExportButton'
import GoalListItem from '../components/pages/goals/GoalListItem'
import {
  GoalCategoryFilter,
  GoalDateOrdering,
  GoalSearch
} from '../components/pages/goals/GoalQuerying'
import OverlaySpinner from '../components/shared/overlaySpinner'
import { DEFAULT_QUERY, PAGINATION_OPTIONS, useGoals } from '../hooks/useGoals'

const Goals: NextPage = () => {
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const { goals, loading, error, count } = useGoals(query)
  const [expanded, setExpanded] = useState<number | undefined>()

  const handleChangeTab = (
    _event: SyntheticEvent,
    newValue: Goal['status'] | ''
  ) => {
    setQuery((prev) => ({
      ...prev,
      offset: 0,
      status: newValue ? newValue : undefined
    }))
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 3,
          alignItems: 'center'
        }}
      >
        <Tabs value={query.status || ''} onChange={handleChangeTab} centered>
          <Tab label="All" value="" />
          <Tab label="Active" value="IN PROGRESS" />
          <Tab label="Completed" value="ACHIEVED" />
        </Tabs>
        <GoalExportButton />
      </Box>

      {/* Querying */}
      <Grid container sx={{ my: 2 }} spacing={2}>
        <Grid item xs={12} lg={4}>
          <Typography gutterBottom variant="subtitle1">
            Search by keywords: Title, mentor or mentee
          </Typography>
          <GoalSearch query={query} handleChangeQuery={setQuery} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Typography gutterBottom variant="subtitle1">
            Filter by categories
          </Typography>
          <GoalCategoryFilter query={query} handleChangeQuery={setQuery} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Typography gutterBottom variant="subtitle1">
            Sort by
          </Typography>
          <GoalDateOrdering query={query} handleChangeQuery={setQuery} />
        </Grid>
      </Grid>

      <Box>
        <OverlaySpinner active={loading} />
        {!loading && error && (
          <Alert severity="error">
            <AlertTitle>{error}</AlertTitle>
            Please refresh the page or contact IT for assistance.
          </Alert>
        )}
        {!loading && !error && goals.length === 0 && (
          <Typography sx={{ textAlign: 'center' }} variant="h6">
            No goals found
          </Typography>
        )}
        {!loading &&
          !error &&
          goals.map((goal) => {
            const handleExpansion = () =>
              goal.id === expanded
                ? setExpanded(undefined)
                : setExpanded(goal.id)
            return (
              <GoalListItem
                key={goal.id}
                goal={goal}
                expanded={expanded === goal.id}
                handleExpansion={handleExpansion}
                orderingDate={query.orderingDate}
              />
            )
          })}
        <TablePagination
          count={count}
          rowsPerPage={query.limit}
          rowsPerPageOptions={PAGINATION_OPTIONS}
          page={query.offset / query.limit}
          component="div"
          onRowsPerPageChange={(e) => {
            setQuery((prev) => ({
              ...prev,
              limit: +e.target.value,
              offset: 0
            }))
          }}
          onPageChange={(_, page) =>
            setQuery((prev) => ({
              ...prev,
              offset: prev.limit * page
            }))
          }
        />
      </Box>
    </>
  )
}

export default Goals
