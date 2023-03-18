import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { fetchMenteeListByMentorId } from '../../api/mentorAccount'
import { useAuth } from '../../context/AuthContext'

export default function MenteeInfo() {
  const { user } = useAuth()
  const [menteeInfo, setMenteeInfo] = useState([] as any[])
  const [currentMentee, setCurrentMentee] = useState(0)

  useEffect(() => {
    fetchMenteeListByMentorId(user!.userId)
      .then(setMenteeInfo)
      .catch((error: any) => console.error('Error:', error))
  }, [])

  return (
    <>
      <Typography
        component="h2"
        variant="button"
        sx={{ fontSize: 16 }}
        color="text.secondary"
        gutterBottom
      >
        Mentee Information
      </Typography>
      {menteeInfo &&
        Object.values(menteeInfo).map((data, index: number, arr) =>
          index === currentMentee ? (
            <div key={index}>
              <Typography
                variant="overline"
                align="left"
                sx={{ mt: 1 }}
                color="text.secondary"
              >
                Name:
              </Typography>
              <Typography align="right" sx={{ mt: -1, mb: 1 }}>
                {data.user.first_name} {data.user.last_name}
              </Typography>
              <Divider />
              <Typography
                variant="overline"
                align="left"
                sx={{ mt: 1 }}
                color="text.secondary"
              >
                Age:
              </Typography>
              <Typography align="right" sx={{ mt: -1, mb: 1 }}>
                25
              </Typography>
              <Divider />
              <Typography
                variant="overline"
                align="left"
                sx={{ mt: 1 }}
                color="text.secondary"
              >
                Start Date:
              </Typography>
              <Typography align="right" sx={{ mt: -1, mb: 1 }}>
                31 Jan, 2020
              </Typography>
            </div>
          ) : null
        )}
      <Divider />
    </>
  )
}
