import { LoadingButton } from '@mui/lab'
import { Icon } from '@mui/material'
import { useState } from 'react'
import { MdDownload } from 'react-icons/md'
import { toast } from 'react-toastify'
import { exportGoals } from '../../api/goals'

const GoalExportButton = () => {
  const [loading, setLoading] = useState(false)

  const download = async () => {
    try {
      setLoading(true)
      const csv = await exportGoals()
      // Download
      const a = document.createElement('a')
      const file = new Blob([csv], { type: 'text/plain' })
      a.href = URL.createObjectURL(file)
      a.download = 'goals.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (_err) {
      toast.error('Cannot export goals. Please try again later')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoadingButton
      onClick={download}
      disabled={loading}
      startIcon={<Icon component={MdDownload} />}
      variant="outlined"
      loading={loading}
      loadingPosition="start"
    >
      Export
    </LoadingButton>
  )
}

export default GoalExportButton
