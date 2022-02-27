from sessions.models import MentorSession
from users.models import MentorUser
import schedule
import time
import threading
from datetime import datetime
from .serializers import *
from .models import NotificationType

def handle_monthly_notifications():
    today = datetime.now()
    if today.day != 1:
        # Not the first day of the month so skip executing the notifications
        return

    mentors = MentorUser.objects.all()
    notification_types = NotificationType.objects.filter(type="MONTHLY") 

    for notif_type in notification_types.iterator():
        for mentor in mentors.iterator():
            notif = Notification(
                notification_type = notif_type,
                mentor = mentor.user,
                creation_date = today,
                is_read = False)
            notif.save() 

def run_scheduled_jobs():
    while True:
        schedule.run_pending()
        time.sleep(1)

t = threading.Thread(target=run_scheduled_jobs)
t.setDaemon(True)
t.start()

schedule.every(1).day.do(handle_monthly_notifications)