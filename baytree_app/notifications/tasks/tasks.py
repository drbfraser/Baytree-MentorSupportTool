from sessions.models import MentorSession
from users.models import MentorUser
import schedule
import time
import threading
from datetime import datetime
from ..serializers import *
from ..models import NotificationType
from .missing_questionnaires import handle_weekly_missing_questionnaire_reminder
from .monthly_questionnaire_reminder import handle_monthly_notifications
     
def run_scheduled_jobs():
    while True:
        schedule.run_pending()
        time.sleep(1)

t = threading.Thread(target=run_scheduled_jobs)
t.setDaemon(True)
t.start()

schedule.every(1).day.do(handle_monthly_notifications)
schedule.every(7).days.do(handle_weekly_missing_questionnaire_reminder)