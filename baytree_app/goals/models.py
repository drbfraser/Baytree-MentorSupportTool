from django.db import models
from users.models import MentorUser

class GoalOption(models.Model):
    name = models.CharField(max_length=1000)

    def __str__(self):
        return self.name

class Goal(models.Model):
    class Status(models.TextChoices):
        ACHIEVED = 'ACHIEVED', "ACHIEVED"
        IN_PROGRESS = 'IN PROGRESS', "IN PROGRESS"
        RECALIBRATED = 'RECALIBRATED', "RECALIBRATED"

    mentor = models.ForeignKey(MentorUser, related_name="goal_mentor", on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=100)
    creation_date = models.DateField(auto_now_add=True)
    goal_review_date = models.DateField()
    last_update_date = models.DateTimeField(auto_now=True)
    description = models.CharField(max_length=1000)
    status = models.CharField(
        max_length = 12,
        choices=Status.choices,
        default=Status.IN_PROGRESS)
    options = models.ManyToManyField(GoalOption)

    def __str__(self):
        return self.title