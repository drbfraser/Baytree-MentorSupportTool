from http.client import INTERNAL_SERVER_ERROR
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import AdminSerializer, MentorSerializer
from .models import CustomUser, MentorUser
from sessions.models import MentorSession
from .permissions import *


class MentorsView(APIView):
    permission_classes = [MentorsViewPermissions]

    def get(self, request, id=None):
        item = MentorUser.objects.get(user_id=id)
        serializer = MentorSerializer(item)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


class AdminsView(APIView):
    permission_classes = [IsAdmin | IsSuperUser]

    def get(self, request, id=None):
        try:
            if id == None:
                return Response({"error": "Please give an id as a URL parameter."},
                                status=status.HTTP_400_BAD_REQUEST)
            admin = AdminUser.objects.get(user_id=id)
            serializer = AdminSerializer(admin)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Failed to retrieve admin object."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, id=None):
        try:
            data = request.data
            email = data["email"]
            password = data["password"]
            if not CustomUser.objects.filter(email=email).exists():
                customUser = CustomUser.objects.create_user(email=email,
                                                            password=password)
                AdminUser.objects.create(user=customUser)
                return Response({"success": "Admin created successfully"},
                         status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Failed to create admin: email already exists."},
                                status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": "Failed to create admin."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StatisticViews(APIView):

    def get(self, request, type, id):
        if type == "mentor":
            sessions_total = MentorSession.objects.filter(mentor_id=id).count()
            sessions_attended = MentorSession.objects.filter(
                mentor_id=id).filter(attended_by_mentor=True).count()
            sessions_missed = MentorSession.objects.filter(
                mentor_id=id).filter(attended_by_mentor=False).count()
            sessions_remaining = 52 - sessions_total  # sessions assumed to be once a week
        elif type == "mentee":
            sessions_total = MentorSession.objects.filter(mentee_id=id).count()
            sessions_attended = MentorSession.objects.filter(
                mentee_id=id).filter(attended_by_mentee=True).count()
            sessions_missed = MentorSession.objects.filter(
                mentee_id=id).filter(attended_by_mentee=False).count()
            sessions_remaining = 52 - sessions_total  # sessions assumed to be once a week
        return Response(
            {"status": "success", "data": {"sessions_total": sessions_total, "sessions_attended": sessions_attended,
                                           "sessions_missed": sessions_missed,
                                           "sessions_remaining": sessions_remaining}},
            status=status.HTTP_200_OK)
