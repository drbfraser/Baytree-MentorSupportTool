from django.db import models
from users.models import CustomUser

class NotificationType(models.Model):
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=1000)
    type = models.CharField(max_length=100)
    period_in_days = models.IntegerField()

    def __str__(self):
        return self.title

class Notification(models.Model):
    notification_type = models.ForeignKey(NotificationType, related_name="notification_notification_type", on_delete=models.PROTECT, null=True)
    mentor = models.ForeignKey(CustomUser, related_name="notfication_mentor", on_delete=models.PROTECT, null=True)
    creation_date = models.DateField()
    is_read = models.BooleanField()
    content = models.CharField(max_length=1000)

    def __str__(self):
        return self.notification