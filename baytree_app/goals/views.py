from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import GoalsSerializer
from .models import Goal
from .permissions import *


class GoalViews(APIView):

    permission_classes = [IsOwner]

    def get(self, request, id=None):
        item = Goal.objects.all()
        serializer = GoalsSerializer(item, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
