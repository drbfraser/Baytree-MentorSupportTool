import {Calendar, dateFnsLocalizer} from 'react-big-calendar'
import moment from 'moment'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import addHours from 'date-fns/addHours'
import startOfHour from 'date-fns/startOfHour'

import Card from '@mui/material/Card'

import 'react-big-calendar/lib/css/react-big-calendar.css'

export default function Scheduler(){
    const locales = {
        'en-US': enUS,
      }
      const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1)
      const now = new Date()
      const start = endOfHour(now)
      const end = addHours(start, 2)
      // The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
      const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
      })

    return (
        <div>
            <Card sx = {{border: 0.1, boxShadow: 2, borderRadius: 5, p: 3, mb: 5}} style = {{height: "55vh"}}>
                <Calendar
                localizer={localizer}
                startAccessor="start"
                endAccessor="end"
                />
            </Card>
        </div>
    )
}