from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import AdminPermissions, userIsAdmin, userIsSuperUser
from rest_framework import status

from users.models import MentorUser
from .constants import base_url, views_username, views_password
from .permissions import *
import requests
import json
import re


class ResourceView(APIView):
    permission_classes = [IsAuthenticated & (AdminPermissions | IsUserAMentor)]

    def get(self, request, id=None):

        mentorUser = MentorUser.objects.all().filter(user_id=id)
        mentorID = str(mentorUser[0].viewsPersonId)

        # Mentors can only access resources or an admin
        '''if (mentorID != request.user.id \
            and not userIsAdmin(request.user) and not userIsSuperUser(request.user)):
            return Response({'errors': 'You are not permitted to access this resource.'}, status=status.HTTP_401_UNAUTHORIZED)'''
        
        resource = []
        resource.append({"Resource": base_url})
        jsonResource = json.dumps(resource)
        return Response(jsonResource,status=200)


