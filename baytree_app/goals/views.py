from django.http import Http404
from rest_framework.generics import (ListAPIView, ListCreateAPIView,
                                     RetrieveUpdateDestroyAPIView)
from users.models import MentorUser
from users.permissions import userIsAdmin, userIsSuperUser

from .models import Goal, GoalOption
from .serializers import GoalOptionSerializer, GoalSerializer


class MentorGoalQuerySetMixin():  
  def get_queryset(self, *args, **kwargs):
    qs = super().get_queryset(*args, **kwargs)
    user = self.request.user
    if userIsAdmin(user) or userIsSuperUser(user): return qs
    return qs.filter(mentor__user_id=user.id)

# GET, POST /api/goals/
class GoalListCreateAPIView(
  MentorGoalQuerySetMixin,
  ListCreateAPIView):
  queryset = Goal.objects.all()
  serializer_class = GoalSerializer

  def get_queryset(self, *args, **kwargs):
    qs = super().get_queryset(*args, **kwargs)
    active = self.request.query_params.get('active')
    if active is not None: qs = qs.filter(status="IN PROGRESS")
    completed = self.request.query_params.get('completed')
    if completed is not None: qs = qs.filter(status="ACHIEVED")
    return qs

  def perform_create(self, serializer):
      mentors = MentorUser.objects.filter(user_id=self.request.user.id)
      if mentors is None: raise Http404() 
      return serializer.save(mentor=mentors.first(), options=self.request.data["options"])

# GET, PUT, PATCH, DELETE /api/goals/<id>
class GoalRetrieveUpdateDestroyAPIView(
  MentorGoalQuerySetMixin,
  RetrieveUpdateDestroyAPIView):
  queryset = Goal.objects.all()
  serializer_class = GoalSerializer
  lookup_field = 'pk'

  def perform_update(self, serializer):
    return serializer.save(options=self.request.data["options"])

# GET /api/goals/options/
class GoalOPtionsListView(ListAPIView):
  queryset = GoalOption.objects.all()
  serializer_class = GoalOptionSerializer