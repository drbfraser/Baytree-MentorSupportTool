from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import GoalSerializer
from .models import Goal
from .permissions import *

#adapted from https://stackabuse.com/creating-a-rest-api-with-django-rest-framework/

class GoalViews(APIView):

    permission_classes = [IsOwner]
    
    def post(self, request):
        serializer = GoalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, id=None):
        if id:
            item = Goal.objects.get(id=id)
            serializer = GoalSerializer(item)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
            
        item = Goal.objects.all()
        serializer = GoalSerializer(item, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    