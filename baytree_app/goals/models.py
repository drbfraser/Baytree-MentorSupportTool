import datetime
from django.db import models
from baytree_app.views_api.participants import get_participant_by_id
from users.models import CustomUser

class Goal(models.Model):
    class Status(models.TextChoices):
        ACHIEVED = 'ACHIEVED', "ACHIEVED"
        IN_PROGRESS = 'IN PROGRESS', "IN PROGRESS"
        RECALIBRATED = 'RECALIBRATED', "RECALIBRATED"

    mentor = models.ForeignKey(CustomUser, related_name="goal_mentor", on_delete=models.SET_NULL, null=True)
    mentee_id = models.IntegerField(null=True)
    title = models.CharField(max_length=100)
    creation_date = models.DateField()
    goal_review_date = models.DateField()
    last_update_date = models.DateTimeField(auto_now=True)
    description = models.CharField(max_length=1000)
    status = models.CharField(
        max_length = 12,
        choices=Status.choices,
        default=Status.IN_PROGRESS)

    def __str__(self):
        return self.title

    def get_mentee(self):
        if self.mentee_id is None: return None
        return get_participant_by_id(self.mentee_id)