from django.db import models

# Create your models here.
from users.models import CustomUser


class MentorWorkLog(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    clock_in = models.DateTimeField(blank=True, null=True)
    clock_out = models.DateTimeField(blank=True, null=True)
    notes = models.CharField(blank=True, max_length=1000)


