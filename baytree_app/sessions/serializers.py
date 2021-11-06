from rest_framework import serializers
from .models import MentorSession


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorSession
        fields = ['mentor', 'mentee', 'clock_in', 'clock_out', 'notes']

    def create(self, validated_data):
        return MentorSession.objects.create(
            mentor=validated_data.get('mentor'),
            mentee=validated_data.get('mentee'),
            clock_in=validated_data.get('clock_in'),
            clock_out=validated_data.get('clock_out'),
            notes=validated_data.get('notes')
        )
