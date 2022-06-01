# Code adapted from https://www.django-rest-framework.org/tutorial/quickstart/

from rest_framework import serializers
from .models import MentorSession


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorSession
        fields = [
            "id",
            "created_at",
            "updated_at",
            "mentor",
            "mentee",
            "attended_by_mentor",
            "attended_by_mentee",
            "clock_in",
            "clock_out",
            "notes",
            "cancelled",
            "viewsSessionId",
        ]

    def create(self, validated_data):
        return MentorSession.objects.create(
            id=validated_data.get("id"),
            created_at=validated_data.get("created_at"),
            updated_at=validated_data.get("updated_at"),
            mentor=validated_data.get("mentor"),
            mentee=validated_data.get("mentee"),
            attended_by_mentor=validated_data.get("attended_by_mentor"),
            attended_by_mentee=validated_data.get("attended_by_mentee"),
            clock_in=validated_data.get("clock_in"),
            clock_out=validated_data.get("clock_out"),
            notes=validated_data.get("notes"),
            cancelled=False
            if validated_data.get("cancelled") == None
            else validated_data.get("cancelled"),
            viewsSessionId=validated_data.get("cancelled"),
        )
