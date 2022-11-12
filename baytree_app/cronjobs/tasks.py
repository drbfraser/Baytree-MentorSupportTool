from celery import shared_task
from users.models import (
    MentorUser, 
    Mentoring,
    SessionStats
)
from users.constants import (
    views_username,
    views_password,
    views_mentor_base_url,
    views_mentee_base_url,
)

import requests
import xmltodict

@shared_task(name="store_active_mentors")
def store_active_mentors():
    mentors = MentorUser.objects.all()
    for mentor in mentors:
        if mentor.menteeUsers.all()[:1]:
            mentor.status = "Active"
        else:
            mentor.status = "Inactive"
        mentor.save()

@shared_task(name="store_sessions_statistics")
def store_sessions_statistics():
    mentors = MentorUser.objects.all()

    for mentor in mentors:
        sessions_total = sessions_attended = sessions_missed = 0
        sessions_total_perYear = 52  # sessions assumed to be once a week
        all_volunteer_url = views_mentor_base_url + str(mentor.viewsPersonId)
        try:
            responseSession = requests.get(
                all_volunteer_url + "/sessions",
                headers={"content-type": "text/xml"},
                auth=(views_username, views_password),
            )
            parsedSession = xmltodict.parse(responseSession.text)

            if parsedSession["volunteer"]["sessions"] is not None:
                volunteerSessionList = parsedSession["volunteer"]["sessions"]["session"]
                for sessionDict in volunteerSessionList:
                    sessions_total += 1
                    if sessionDict["Status"] == "Attended":
                        sessions_attended += 1
                    else:
                        sessions_missed += 1
                sessions_remaining = sessions_total_perYear - sessions_total
                mentor_stats = SessionStats.objects.filter(mentor=mentor)
                if len(mentor_stats) == 0:
                    SessionStats.objects.create(mentor=mentor)

                else:
                    mentor_stats.update(
                        sessions_attended=sessions_attended,
                        sessions_missed=sessions_missed,
                        sessions_remaining=sessions_remaining,
                        sessions_total=sessions_total,
                    )
                    print("Session stats updated")
        except Exception as e:
            pass
        return "Task completed"





