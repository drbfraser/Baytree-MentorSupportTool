from django.db import models

# Create your models here.
from users.models import CustomUser


class MentorWorkLog(models.Model):
    mentor = models.ForeignKey(CustomUser, on_delete=models.PROTECT)
    mentee = models.ForeignKey(CustomUser, on_delete=models.PROTECT)
    clock_in = models.DateTimeField(blank=True, null=True)
    clock_out = models.DateTimeField(blank=True, null=True)
    notes = models.CharField(blank=True, max_length=1000)


