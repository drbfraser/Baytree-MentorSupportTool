import { LoadingButton } from '@mui/lab'
import { Icon } from '@mui/material'
import { type FunctionComponent, useState } from 'react'
import { MdDownload } from 'react-icons/md'
import { toast } from 'react-toastify'
import useSessionDetail from '@hooks/useSessionDetail'

type Props = {
  sessionId?: string | number
}

const RecordExportDetailButton: FunctionComponent<Props> = ({ sessionId }) => {
  const [loading, setLoading] = useState(false)
  const { session } = useSessionDetail(sessionId)

  const download = () => {
    try {
      setLoading(true)
      const csv = SessionDetailsToCSV(JSON.stringify(session))

      // Download
      const a = document.createElement('a')
      const file = new Blob([csv], { type: 'text/plain' })

      a.href = URL.createObjectURL(file)
      a.download = `Records of ${session?.name} ${session?.startDate}.csv`

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (_err) {
      toast.error('Cannot export record. Please try again later')
    } finally {
      setLoading(false)
    }
  }

  const SessionDetailsToCSV = (session: string) => {
    // only takes the necessary data
    if (session == null) {
      return ''
    }
    // convert to json
    const sessionInfo = JSON.parse(session)
    const row: { [key: string]: string } = {}
    console.log(sessionInfo)
    row.sessionName = sessionInfo.name ? sessionInfo.name : ''
    row.sessionGroup = sessionInfo.sessionGroup.name
      ? sessionInfo.sessionGroup.name
      : ''
    row.mentor = sessionInfo.mentor.name
      ? sessionInfo.mentor.name
      : sessionInfo.mentor.firstname + ' ' + sessionInfo.mentor.surname
    row.mentee = sessionInfo.mentee.name
      ? sessionInfo.mentee.name
      : sessionInfo.mentee.firstname + sessionInfo.mentee.surname
    row.startDate = sessionInfo.startDate ? sessionInfo.startDate : ''
    row.startTime = sessionInfo.startTime ? sessionInfo.startTime : ''
    row.Duration = sessionInfo.duration ? sessionInfo.duration : ''
    row.notes = sessionInfo.note ? sessionInfo.note : ''
    // convert back to string
    return JSON.stringify(row)
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

export default RecordExportDetailButton
