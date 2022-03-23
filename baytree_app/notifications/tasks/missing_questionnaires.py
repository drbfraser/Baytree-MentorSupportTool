from sessions.models import MentorSession
from users.models import MentorUser
import schedule
import time
import threading
import requests
import json
import datetime
from ..serializers import *
from ..models import NotificationType
from ..constants import VIEWS_USERNAME, VIEWS_PASSWORD, VIEWS_BASE_URL

# The identifier for mentee is inside the questionnaire. Its question ID is 24 for the questionnaire 10.
# Change this in case questionnaire ID changes.
MENTEE_NAME_ANSWER_ID = 24
QUESTIONNAIRE_ID = 10

def get_mentee_name(mentorId, answerId):
    url = '{0}/evidence/questionnaires/{1}/answers/{2}?allquestions=1.json'.format(VIEWS_BASE_URL, QUESTIONNAIRE_ID, answerId)
    r = requests.get(url, auth=(VIEWS_USERNAME, VIEWS_PASSWORD))
    if r.status_code != 200:
        print('Failed to get answers. Status code: {0}'.format(r.status_code))
        return []

    answer = json.loads(r.content)
    answerKey = ''
    for key in answer:
        if 'answers count' in key:
            answerKey = key
            break

    menteeNameKey = 'answer id="{0}"'.format(MENTEE_NAME_ANSWER_ID)
    if menteeNameKey in answer[answerKey]:
        menteeName = answer[answerKey][menteeNameKey]['Answer']
        return menteeName

    return None

def get_missing_questionnaires(viewsMentorId):
    url = '{0}/evidence/questionnaires/{1}/answers?allquestions=1.json'.format(VIEWS_BASE_URL, QUESTIONNAIRE_ID)
    r = requests.get(url, auth=(VIEWS_USERNAME, VIEWS_PASSWORD))
    if r.status_code != 200:
        print('Failed to get answers. Status code: {0}'.format(r.status_code))
        return []

    firstDayThisMonth = datetime.date.today().replace(day=1)
    firstDayLastMonth = (firstDayThisMonth - datetime.timedelta(days=1)).replace(day=1)
    lastMonthsQues = set()
    thisMonthsQues = set()

    answers = json.loads(r.content)
    for key in answers:
        answer = answers[key]
        if answer['EntityType'] != 'Volunteer':
            continue

        mentorId = int(answer['EntityID'])
        answerSetId = answer['AnswerSetID']
        createDate = datetime.datetime.strptime(answer['Date'],'%Y-%m-%dT%H:%M:%S').date()

        if viewsMentorId != mentorId:
            # print('Mentor Ids dont match...')
            continue

        if createDate < firstDayLastMonth:
            print('Skipping...')
            continue

        menteeName = get_mentee_name(mentorId, answerSetId)
        if menteeName is None:
            print('No mentee info found')
            continue

        if createDate >= firstDayThisMonth:
            # This month's questionnaire for this mentor has already been submitted.
            thisMonthsQues.add(menteeName)
            continue
        elif createDate >= firstDayLastMonth:
            lastMonthsQues.add(menteeName)

    missingMentees = lastMonthsQues - thisMonthsQues

    print('Mentor: {0}, Mentees with questionnaires last month: {1}'.format(viewsMentorId, lastMonthsQues))
    print('Mentor: {0}, Mentees with questionnaires this month: {1}'.format(viewsMentorId, thisMonthsQues))
    print('Mentor: {0}, Mentees with missing questionnaires: {1}'.format(viewsMentorId, missingMentees))

    thisMonth = firstDayThisMonth.strftime('%Y-%m')
    ret = []
    for mentee in missingMentees:
        ret.append((mentee, thisMonth))

    # [("mentee name", "2022-01"), ("mentee name", "date")]
    return ret

def handle_weekly_missing_questionnaire_reminder():
    print("handling weekly missing questionnaire notifications...")
    today = datetime.now()

    mentors = MentorUser.objects.all()
    notification_type = NotificationType.objects.get(type="MISSING_QUESTIONNARIE_WEEKLY_REMINDER") 

    for mentor in mentors.iterator():
        missingList = get_missing_questionnaires(mentor.viewsPersonId)

        for missingq in missingList:
            notif = Notification(
                notification_type = notification_type,
                mentor = mentor.user,
                creation_date = today,
                is_read = False,
                content = notification_type.content.format(missingq[1], missingq[0]))
            notif.save() 
