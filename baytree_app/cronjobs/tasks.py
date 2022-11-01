from celery import shared_task
from users.models import MentorUser

@shared_task(name="store_active_mentors")
def store_active_mentors():
    mentors = MentorUser.objects.all()
    for mentor in mentors:
        if mentor.menteeUsers.all()[:1]:
            mentor.status = "Active"
        else:
            mentor.status = "Inactive"
        mentor.save()



