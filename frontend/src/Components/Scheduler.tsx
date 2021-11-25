import {useState, useEffect} from 'react'

import {Calendar, dateFnsLocalizer} from 'react-big-calendar'
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
    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    })
    const [sessionList, setSessionList] = useState([] as any[]);
    var events: any = [];
    
    useEffect(() => {
    fetch('http://localhost:8000/sessions/', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    })
    .then (response => response.json())
    .then (data => {
        data.map((values: any, index: number) => {
            var event = {
                title: "Session " + (index+1),
                start: new Date(values.clock_in),
                end: new Date(values.clock_out),
                allDay: false
            }
            events = [...events, event];
        })
        setSessionList(events);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    }, []);

    return (
        <div>
            <Card sx = {{border: 0.1, boxShadow: 2, borderRadius: 5, p: 3, mb: 5}} style = {{height: "55vh"}}>
                <Calendar
                localizer={localizer}
                allDayAccessor = "false"
                events = {sessionList}
                />
            </Card>
        </div>
    )
}