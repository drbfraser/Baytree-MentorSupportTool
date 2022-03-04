from django.db import models
from users.models import CustomUser

class Goal(models.Model):
    class Status(models.TextChoices):
        ACHIEVED = 'ACHIEVED', "ACHIEVED"
        IN_PROGRESS = 'IN PROGRESS', "IN PROGRESS"
        RECALIBRATED = 'RECALIBRATED', "RECALIBRATED"

    mentor = models.ForeignKey(CustomUser, related_name="goal_mentor", on_delete=models.SET_NULL, null=True)
    mentee = models.ForeignKey(CustomUser, related_name="goal_mentee", on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=100)
    date = models.DateField()
    goal_review_date = models.DateField()
    content = models.CharField(max_length=1000)
    status = models.CharField(
        max_length = 12,
        choices=Status.choices,
        default=Status.IN_PROGRESS)

    def __str__(self):
        return self.title