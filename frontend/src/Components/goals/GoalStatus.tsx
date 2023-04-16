import { Chip } from '@mui/material'
import type { FunctionComponent } from 'react'
import type { Goal } from '../../api/goals'

const GoalStatus: FunctionComponent<{ status: Goal['status'] }> = ({
  status
}) => {
  const color =
    status === 'IN PROGRESS'
      ? 'secondary'
      : status === 'ACHIEVED'
      ? 'primary'
      : 'warning'

  return <Chip color={color} size="small" label={status} />
}

export default GoalStatus
