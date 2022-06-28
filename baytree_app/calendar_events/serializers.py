from rest_framework import serializers

from .models import CalendarEvent

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