from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import SessionSerializer
from .models import MentorSession
from .permissions import *

class SessionViews(APIView):
    permission_classes = [IsOwner]
    
    def get(self, request, id=None):
        item = MentorSession.objects.get(user_id=id)
        serializer = SessionSerializer(item)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
