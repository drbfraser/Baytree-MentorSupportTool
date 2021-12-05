from rest_framework import status
from rest_framework.response import Response
from rest_framework import filters
from rest_framework import generics

from .serializers import GoalSerializer
from .models import Goal
from .permissions import *

#adapted from https://stackabuse.com/creating-a-rest-api-with-django-rest-framework/

class GoalViews(generics.ListAPIView):

    permission_classes = [IsOwner]

    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['mentee', 'title', 'date', 'goal_review_date', 'status']

    def post(self, request):
        serializer = GoalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
     
    def patch(self, request, id=None):
        item = Goal.objects.get(id=id)
        serializer = GoalSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data})
        else:
            return Response({"status": "error", "data": serializer.errors})