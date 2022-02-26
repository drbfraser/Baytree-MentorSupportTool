import {useState, useEffect} from 'react'

import {Calendar, dateFnsLocalizer} from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'

import Card from '@mui/material/Card'

import Holidays from '../Utils/Holidays'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import { API_BASE_URL } from '../api/url'

type Props = {
    height: string;
}

const Scheduler: React.FC<Props> = ({height}) => {
    const locales = {
        'en-US': enUS,
      }
    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    })
    const [sessionList, setSessionList] = useState([] as any[]);

    const handleEventClick = (e: React.SyntheticEvent) => {
        alert("hi")
    }
    
    useEffect(() => {
        fetch(`${API_BASE_URL}/sessions/`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: "include"
        })
        .then (response => response.json())
        .then ((data: any[]) => {
            setSessionList(data.map((values, index) => ({
                title: "Session " + (index+1),
                start: new Date(values.clock_in),
                end: new Date(values.clock_out),
                allDay: false
            })));
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }, []);

    return (
        <div>
            <Card sx = {{boxShadow: 2, p: 3, mb: 3}} style = {{height: height}}>
                <Calendar
                localizer={localizer}
                events = {[...sessionList, ...Holidays]}
                onSelectEvent = {handleEventClick}
                />
            </Card>
        </div>
    )
}

export default Scheduler;