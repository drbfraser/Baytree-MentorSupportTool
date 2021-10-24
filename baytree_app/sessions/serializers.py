from rest_framework import serializers

from sessions.models import MentorSession


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = MentorSession
        fields = ['mentor', 'mentee', 'clock_in', 'clock_out', 'notes']
