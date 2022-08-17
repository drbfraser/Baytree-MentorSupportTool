from rest_framework import serializers

from .models import CalendarEvent, UkHoliday

class UkHolidaySerializer(serializers.ModelSerializer):
  class Meta:
    model = UkHoliday
    fields = [
      "name",
      "date"
    ]

class CalendarEventSerializer(serializers.ModelSerializer):
  class Meta:
    model = CalendarEvent
    fields = [
      "id",
      "title",
      "startDate",
      "endDate",
      "isAnnual",
      "note"
    ]