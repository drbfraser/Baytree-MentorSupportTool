from rest_framework import serializers

from .models import Holiday

class HolidaySerializer(serializers.ModelSerializer):
  class Meta:
    model = Holiday
    fields = [
      "id",
      "title",
      "startDate",
      "endDate",
      "isAnnual"
    ]