from django.http import Http404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters
from rest_framework.response import Response
from users.models import MentorUser
from users.permissions import userIsAdmin, userIsSuperUser

from .models import Goal, GoalCategory
from .serializers import GoalCategorySerializer, GoalDetailSerializer, GoalSerializer


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
  filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
  ordering_fields = ['creation_date', 'goal_review_date', 'last_update_date']
  filterset_fields = ['status']

  def get_queryset(self, *args, **kwargs):
    qs = super().get_queryset(*args, **kwargs)
    categoryParams = self.request.GET.get('categories', None)
    if categoryParams is not None:
      ids = [int(x) for x in categoryParams.split(',')]
      for id in ids:
        qs = qs.filter(categories__id=id)
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
  serializer_class = GoalDetailSerializer
  lookup_field = 'pk'

  def perform_update(self, serializer):
    if self.request.method != "PATCH":
      return serializer.save(categories=self.request.data["categories"])
    else:
      return serializer.save()

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
