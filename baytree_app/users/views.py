from http.client import INTERNAL_SERVER_ERROR, HTTPResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from views_api.volunteers import get_volunteers
from .serializers import AdminSerializer, MentorSerializer
from .models import CustomUser, MentorUser
from sessions.models import MentorSession
from .permissions import *
from rest_framework.decorators import api_view, permission_classes

def postUser(self, request):
    try:
        ids = []
        if "array" in request.data:
            for object in request.data["array"]:
                create_args = {}

                for key, val in object.items():
                    if not isinstance(val, list):
                        create_args[key] = val

                created_obj = self.model().__class__.objects.create_user(**create_args)

                ids.append(created_obj.pk)

                for key, val in object.items():
                    if isinstance(val, list):
                        getattr(created_obj, key).add(*val)

            return Response({"ids": ids},
                            status=status.HTTP_200_OK)
        else:
            object = request.data
            create_args = {}

            for key, val in object.items():
                if not isinstance(val, list):
                    create_args[key] = val

            created_obj = self.model().__class__.objects.create_user(**create_args)

            ids.append(created_obj.pk)

            for key, val in object.items():
                if isinstance(val, list):
                    getattr(created_obj, key).add(*val)

            return Response({"ids": [created_obj.pk]},
                            status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "Failed to create object"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StatisticViews(APIView):
    permission_classes = [MentorsViewPermissions]

    def get(self, request, type):
        id = request.GET.get('id', None)
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
