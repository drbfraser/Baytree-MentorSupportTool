from celery import shared_task
from users.models import MentorUser

@shared_task(name="store_active_mentors")
def store_active_mentors():
    """
    TODO: Store active mentors          
    Task to store active mentors
    Currently just returns active mentors
    """
    active_mentors = MentorUser.objects.filter(status="Active")
    return list(active_mentors)
