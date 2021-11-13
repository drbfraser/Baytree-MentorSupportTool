from django.db import models
from users.models import CustomUser
import datetime

class Goal(models.Model):
    class Status(models.TextChoices):
        ACHIEVED = 'ACHIEVED', "ACHIEVED"
        IN_PROGRESS = 'IN PROGRESS', "IN PROGRESS"
        RECALIBRATED = 'RECALIBRATED', "RECALIBRATED"

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField(datetime.date.today())
    goal_review_date = models.DateField()
    content = models.CharField(max_length = 1000)
    status = models.CharField(
        max_length = 2,
        choices=Status.choices,
        default=Status.IN_PROGRESS)
    
    def __str__(self):
        return self.title
