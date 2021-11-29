from rest_framework import serializers
from .models import MonthlyReport


class MonthlyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyReport
        fields = ['id', 'created_at', 'updated_at', 'mentor', 'mentee']

    def create(self, validated_data):
        return MonthlyReport.objects.create(
            id=validated_data.get('id'),
            created_at=validated_data.get('created_at'),
            updated_at=validated_data.get('updated_at'),
            mentor=validated_data.get('mentor'),
            mentee=validated_data.get('mentee')
        )

