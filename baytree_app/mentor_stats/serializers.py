from rest_framework import serializers
from .models import MentorStats


class MentorStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorStats
        fields = ['id', 'mentor', 'sessions_total', 'sessions_attended', 'sessions_missed']

    def create(self, validated_data):
        return MentorStats.objects.create(
            id=validated_data.get('id'),
            mentor=validated_data.get('mentor'),
            sessions_total=validated_data.get('sessions_total'),
            sessions_attended=validated_data.get('sessions_attended'),
            sessions_missed=validated_data.get('sessions_missed')
        )