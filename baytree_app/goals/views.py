from django.http import Http404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters
from rest_framework.response import Response
from users.models import MentorUser
from users.permissions import userIsAdmin, userIsSuperUser

from .models import Goal, GoalCategory
from .serializers import GoalCategorySerializer, GoalDetailSerializer, GoalSerializer

import csv
import io

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



# GET /api/goals/export/
class GoalExportsAPIView(MentorGoalQuerySetMixin, generics.GenericAPIView):
  queryset = Goal.objects.all()

  def get(self, request):
    all = self.get_queryset()
    cache = {}

    def get_mentee_name(goal):
      id = goal.mentee_id
      if id is None: return None
      key = f"mentee-{id}"
      if key not in cache:
        mentee = goal.get_mentee()
        if mentee is None: cache[key] = None
        cache[key] = f"{mentee['firstName']} {mentee['lastName']}"
      return cache[f"mentee-{id}"]

    def goal_to_csv_row(goal):
      row = {}
      mentor = goal.mentor
      row["Mentor"] = mentor.user.email if mentor is not None else ""
      row["Title"] = goal.title
      row["Creation Date"] = goal.creation_date.strftime("%Y-%m-%d")
      row["Review Date"] = goal.goal_review_date.strftime("%Y-%m-%d")
      row["Last Update"] = goal.last_update_date.strftime("%Y-%m-%d")
      row["Status"] = goal.status
      row["Description"] = goal.description
      row["Categories"] = ", ".join([category.name for category in goal.categories.iterator()])
      mentee = get_mentee_name(goal)
      row["Mentee"] = "" if mentee is None else mentee
      return row

    with io.StringIO() as csvFile:
      fieldsname = ["Mentor", "Mentee", "Title", "Creation Date", "Review Date", "Last Update", "Status", "Description", "Categories"]
      writer = csv.DictWriter(csvFile, fieldnames=fieldsname, quoting=csv.QUOTE_ALL)

      writer.writeheader()
      for goal in all.iterator():
        row = goal_to_csv_row(goal)
        writer.writerow(row)

      return Response(csvFile.getvalue())
