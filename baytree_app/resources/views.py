from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import AdminPermissions, userIsAdmin, userIsSuperUser
from rest_framework import status
from users.models import MentorUser
from .constants import base_url
from .permissions import *
import json

class ResourceView(APIView):
    permission_classes = [IsAuthenticated & (AdminPermissions | IsUserAMentor)]

    def get(self, request):   
        resource = []
        resource.append({"Resource": base_url})
        jsonResource = json.dumps(resource)
        return Response(jsonResource,status=200)


