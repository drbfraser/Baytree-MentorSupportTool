from rest_framework import serializers
from .models import MonthlyReport

class MonthlyReportSerializer(serializers.ModelSerializer):
    date = serializers.DateField()
    time = serializers.TimeField()
    mentor = serializers.CharField(max_length=100)
    mentee = serializers.CharField(max_length=100)
    reporting_month = serializers.IntegerField()
    mentee_engagement = serializers.IntegerField(required=False)
    mentee_on_time = serializers.IntegerField()

    class Meta:
        model = MonthlyReport
        fields = ('__all__')