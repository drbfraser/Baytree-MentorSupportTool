from django.http import Http404
from rest_framework import generics, filters
from rest_framework.response import Response
from users.models import MentorUser
from users.permissions import userIsAdmin, userIsSuperUser

from .models import Goal, GoalCategory
from .serializers import GoalCategorySerializer, GoalSerializer


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
  filter_backends = [filters.OrderingFilter]
  ordering_fields = ['creation_date', 'review_date', 'last_update_date']

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
      return serializer.save(mentor=mentors.first(), categories=self.request.data["categories"])

# GET, PUT, PATCH, DELETE /api/goals/<id>
class GoalRetrieveUpdateDestroyAPIView(
  MentorGoalQuerySetMixin,
  generics.RetrieveUpdateDestroyAPIView):
  queryset = Goal.objects.all()
  serializer_class = GoalSerializer
  lookup_field = 'pk'

  def perform_update(self, serializer):
    return serializer.save(categories=self.request.data["categories"])

# GET /api/goals/categories/
class GoalCategoryListView(generics.ListAPIView):
  queryset = GoalCategory.objects.all()
  serializer_class = GoalCategorySerializer

# GET /api/goals/statistics/
class GoalStatisticsAPIView(MentorGoalQuerySetMixin, generics.GenericAPIView):
  queryset = Goal.objects.all()

  def get(self, request):
    all = self.get_queryset()
    active = all.filter(status="IN PROGRESS")
    complete = all.filter(status="ACHIEVED")
    result = {
      "active": len(active),
      "complete": len(complete)
    }
    return Response(result)
