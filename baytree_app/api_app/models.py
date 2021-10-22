from django.db import models

# Create your models here.
class MonthlyReport(models.Model):
    date = models.DateField()
    time = models.TimeField()
    mentor = models.CharField(max_length=100)
    mentee = models.CharField(max_length=100)
    reporting_month = models.IntegerField()
    mentee_engagement = models.IntegerField()
    mentee_on_time = models.IntegerField()