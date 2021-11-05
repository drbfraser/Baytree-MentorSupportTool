from rest_framework import serializers
from .models import MentorSession


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorSession
        fields = ['mentor', 'mentee', 'clock_in', 'clock_out', 'notes']

    def create(self, validated_data):
        # Once the request data has been validated, we can create a todo item instance in the database
        return MentorSession.objects.create(
            mentor=validated_data.get('text'),
            mentee=validated_data.get('text'),
            clock_in=validated_data.get('text'),
            clock_out=validated_data.get('text')
        )
