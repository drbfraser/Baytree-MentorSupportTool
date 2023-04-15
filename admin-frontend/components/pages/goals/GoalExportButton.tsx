import { MdFileDownload } from 'react-icons/md'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { downloadBlob } from '../../../util/misc'
import { backendGet } from '../../../api/backend/base'

const GoalExportButton = () => {
  const [loading, setLoading] = useState(false)

  const download = async () => {
    setLoading(true)
    try {
      const data = await backendGet<string>('goals/export/')
      if (!data) throw new Error()
      downloadBlob(data, 'goal', 'text/csv;charset=utf-8;')
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
      startIcon={<MdFileDownload />}
      variant="outlined"
      loading={loading}
      loadingPosition="start"
    >
      Export
    </LoadingButton>
  )
}

export default GoalExportButton
