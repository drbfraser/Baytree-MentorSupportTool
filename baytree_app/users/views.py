from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MentorSerializer
from .models import MentorUser
from sessions.models import MentorSession
from .permissions import *


class MentorViews(APIView):
    permission_classes = [IsOwner]

    def get(self, request, id=None):
        item = MentorUser.objects.get(user_id=id)
        serializer = MentorSerializer(item)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


class StatisticViews(APIView):

    def get(self, request, type, id):
        if type == "mentor":
            sessions_total = MentorSession.objects.filter(mentor_id=id).count()
            sessions_attended = MentorSession.objects.filter(mentor_id=id).filter(attended_by_mentor=True).count()
            sessions_missed = MentorSession.objects.filter(mentor_id=id).filter(attended_by_mentor=False).count()
            sessions_remaining = 52 - sessions_total  # sessions assumed to be once a week
        elif type == "mentee":
            sessions_total = MentorSession.objects.filter(mentee_id=id).count()
            sessions_attended = MentorSession.objects.filter(mentee_id=id).filter(attended_by_mentee=True).count()
            sessions_missed = MentorSession.objects.filter(mentee_id=id).filter(attended_by_mentee=False).count()
            sessions_remaining = 52 - sessions_total  # sessions assumed to be once a week
        return Response(
            {"status": "success", "data": {"sessions_total": sessions_total, "sessions_attended": sessions_attended,
                                           "sessions_missed": sessions_missed,
                                           "sessions_remaining": sessions_remaining}},
            status=status.HTTP_200_OK)
