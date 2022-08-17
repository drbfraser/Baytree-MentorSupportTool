from pickle import FALSE
from turtle import title
from django.db import models

#UK Holiday model
class UkHoliday(models.Model):
    name = models.CharField(max_length=120)
    date = models.DateField() #TODO: May need to change this to a string and then change type on frontend

    def __str__(self):
        return self.name

#Calendar Event Model
class CalendarEvent(models.Model):
  title = models.CharField(max_length=120, null=False)
  startDate = models.DateField()
  endDate = models.DateField()
  isAnnual = models.BooleanField()
  note = models.CharField(max_length=120, null=True)
