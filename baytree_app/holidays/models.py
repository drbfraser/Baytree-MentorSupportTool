from pickle import FALSE
from turtle import title
from django.db import models

# Create your models here.
class Holiday(models.Model):
  title = models.CharField(max_length=120, null=False)
  startDate = models.DateField()
  endDate = models.DateField()
  isAnnual = models.BooleanField()
