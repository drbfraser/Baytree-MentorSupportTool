from rest_framework import filters
from rest_framework import generics

from .serializers import GoalSerializer
from .models import Goal
from .permissions import *

# GET, POST /api/goals/
class GoalListCreateAPIView(generics.ListCreateAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    filter_backends = [filters.OrderingFilter]

# GET, PUT, DELETE /api/goals/<id>
class GoalRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    filter_backends = [filters.OrderingFilter]
    lookup_field = 'pk'