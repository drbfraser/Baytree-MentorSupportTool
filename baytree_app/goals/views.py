from django.http import Http404
from requests import Response
from rest_framework import generics, mixins
from users.models import MentorUser
from users.permissions import userIsAdmin, userIsSuperUser

from .models import Goal
from .serializers import GoalSerializer


class MentorGoalQuerySetMixin():  
  def get_queryset(self, *args, **kwargs):
    qs = super().get_queryset(*args, **kwargs)
    user = self.request.user
    if userIsAdmin(user) or userIsSuperUser(user): return qs
    return qs.filter(mentor__user_id=user.id)

# GET, POST /api/goals/
class GoalListCreateAPIView(
    MentorGoalQuerySetMixin,
    generics.ListCreateAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    def perform_create(self, serializer):
        mentors = MentorUser.objects.filter(user_id=self.request.user.id)
        if mentors is None: raise Http404() 
        return serializer.save(mentor=mentors.first())

# GET, PUT, PATCH, DELETE /api/goals/<id>
class GoalRetrieveUpdateDestroyAPIView(
    MentorGoalQuerySetMixin,
    generics.RetrieveUpdateDestroyAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    lookup_field = 'pk'
