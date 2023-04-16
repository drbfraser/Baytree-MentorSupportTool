import { Mentor } from '../../../../../pages/home'
import { Session } from '../../../../../api/backend/views/sessions'
import { downloadCsv, objectsToCsv } from '../../../../../util/misc'

export interface MentorSessionCount extends Mentor {
  januarySessions: number
  februarySessions: number
  marchSessions: number
  aprilSessions: number
  maySessions: number
  juneSessions: number
  julySessions: number
  augustSessions: number
  septemberSessions: number
  octoberSessions: number
  novemberSessions: number
  decemberSessions: number
}

export const getMentorSessionCounts = (
  mentors: Mentor[],
  sessionsForYear: Session[]
) => {
  const aggregatedSessionsByMentor: MentorSessionCount[] = []

  // Initialize the session counts for each mentor to 0 for each month
  mentors.forEach((mentor, i) =>
    aggregatedSessionsByMentor.push({
      viewsPersonId: mentor.viewsPersonId,
      firstName: mentor.firstName,
      lastName: mentor.lastName,
      email: mentor.email,
      fullName: mentor.fullName,
      januarySessions: 0,
      februarySessions: 0,
      marchSessions: 0,
      aprilSessions: 0,
      maySessions: 0,
      juneSessions: 0,
      julySessions: 0,
      augustSessions: 0,
      septemberSessions: 0,
      octoberSessions: 0,
      novemberSessions: 0,
      decemberSessions: 0
    })
  )

  sessionsForYear.forEach((session) => {
    const sessionLeadStaffId = session.leadStaff

    const aggregatedMentor = aggregatedSessionsByMentor.find(
      (mentor) => mentor.viewsPersonId === sessionLeadStaffId
    )

    if (aggregatedMentor && !session.cancelled) {
      const sessionMonthNum = session.startDate.getMonth()
      switch (sessionMonthNum) {
        case 0:
          aggregatedMentor.januarySessions++
          break
        case 1:
          aggregatedMentor.februarySessions++
          break
        case 2:
          aggregatedMentor.marchSessions++
          break
        case 3:
          aggregatedMentor.aprilSessions++
          break
        case 4:
          aggregatedMentor.maySessions++
          break
        case 5:
          aggregatedMentor.juneSessions++
          break
        case 6:
          aggregatedMentor.julySessions++
          break
        case 7:
          aggregatedMentor.augustSessions++
          break
        case 8:
          aggregatedMentor.septemberSessions++
          break
        case 9:
          aggregatedMentor.octoberSessions++
          break
        case 10:
          aggregatedMentor.novemberSessions++
          break
        case 11:
          aggregatedMentor.decemberSessions++
          break
      }
    }
  })

  // Show mentors in alphabetical order by name
  aggregatedSessionsByMentor.sort((mentor1, mentor2) => {
    return mentor1.fullName.localeCompare(mentor2.fullName)
  })

  return aggregatedSessionsByMentor
}

// get current year start date for academic year (sep-aug) like: '2022-09-01'
export const getCurYearStartDate = (curYear: number): string => {
  const firstDayOfYear = new Date(curYear, 8, 1)
  return firstDayOfYear.toISOString().split('T')[0]
}

// get current year end date for academic year (sep-aug) like: '2023-09-01'
export const getCurYearEndDate = (curYear: number): string => {
  const lastDayOfYear = new Date(curYear + 1, 8, 1)
  return lastDayOfYear.toISOString().split('T')[0]
}

export const onExportButtonClick = (
  mentorSessionCounts: MentorSessionCount[],
  year: number,
  sessionGroup: string
) => {
  const exportedFields = [
    { title: 'Name', field: 'fullName' },
    { title: 'Sep', field: 'septemberSessions' },
    { title: 'Oct', field: 'octoberSessions' },
    { title: 'Nov', field: 'novemberSessions' },
    { title: 'Dec', field: 'decemberSessions' },
    { title: 'Jan', field: 'januarySessions' },
    { title: 'Feb', field: 'februarySessions' },
    { title: 'Mar', field: 'marchSessions' },
    { title: 'Apr', field: 'aprilSessions' },
    { title: 'May', field: 'maySessions' },
    { title: 'Jun', field: 'juneSessions' },
    { title: 'Jul', field: 'julySessions' },
    { title: 'Aug', field: 'augustSessions' }
  ]

  const csvFileContent = objectsToCsv(mentorSessionCounts, exportedFields)
  downloadCsv(
    csvFileContent,
    `Session Statistics ${year}/${year + 1} ${sessionGroup}`
  )
}
