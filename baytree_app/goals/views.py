import csv
import io
import threading

from baytree_app.FluentLoggingHandler import FluentLoggingHandler
from django.http import Http404
from rest_framework import generics
from rest_framework.response import Response
from users.models import MentorUser
from users.permissions import userIsAdmin, userIsSuperUser

from .models import Goal, GoalCategory
from .serializers import (GoalCategorySerializer, GoalDetailSerializer,)


class MentorGoalQuerySetMixin():
    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset(*args, **kwargs)
        user = self.request.user
        if userIsAdmin(user) or userIsSuperUser(user):
            return qs
        return qs.filter(mentor__user_id=user.id)


"""
  This filter can only filter mentor and title which stored in the local database
  unused until someone can implement get mentee name in serializers
"""

# class GoalSearchFilter(filters.SearchFilter):
#   def get_search_fields(self, view, request):
#
#
#     fields = ["title"]
#     user = request.user
#     if userIsAdmin(user) or userIsSuperUser(user): fields.append("^mentor__user__email")
#
#     #fields.append("^mentee__firstName")
#     return fields

# GET, POST /api/goals/


class GoalListCreateAPIView(
        MentorGoalQuerySetMixin,
        generics.ListCreateAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalDetailSerializer

    # unused
    # filter_backends = (GoalSearchFilter, filters.OrderingFilter, DjangoFilterBackend)

    ordering_fields = ['creation_date', 'goal_review_date', 'last_update_date']
    filterset_fields = ['status']

    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset(*args, **kwargs)

        categoryParams = self.request.GET.get('categories', None)
        qs = self.CategoryParamsQueryFilter(qs, categoryParams)

        serachQuery = self.request.GET.get('search', None)

        # join 3 queries for search field
        titleQuerySet = self.TitleQueryFilter(qs, serachQuery)
        mentorQuerySet = self.MentorEmailQueryFilter(qs, serachQuery)
        menteeQuerySet = self.MenteeNameQueryFilter(qs, serachQuery)

        qs = titleQuerySet | mentorQuerySet | menteeQuerySet

        FluentLoggingHandler.info(
            f"{self.request.user} is getting goals by the following search query: {serachQuery}")

        return qs

    def TitleQueryFilter(self, qs, query):
        # process query base on title
        FluentLoggingHandler.info(f"Filtering goals by title: {query}")
        if query is not None:
            titles = []
            for goal in qs.all():
                if query in goal.title:
                    titles.append(goal.title)

            return qs.filter(title__in=titles)
        return qs

    def MentorEmailQueryFilter(self, qs, query):
        # process query base on mentor email
        FluentLoggingHandler.info(f"Filtering goals by mentor email: {query}")
        if query is not None:
            email = []
            for goal in qs.all():
                if query in goal.mentor.user.email:
                    email.append(goal.mentor.user.email)
            return qs.filter(mentor__user__email__in=email)
        return qs

    def CategoryParamsQueryFilter(self, qs, query):
        # process query base on category
        FluentLoggingHandler.info(f"Filtering goals by category: {query}")
        if query is not None:
            ids = [int(x) for x in query.split(',')]
            for id in ids:
                qs = qs.filter(categories__id=id)

        return qs

    def MenteeNameQueryFilter(self, qs, query):
        # process query base on mentor name
        FluentLoggingHandler.info(f"Filtering goals by mentor name: {query}")
        if query:
            id = []
            running_thread = []
            # multithreading for multiple get request
            for goal in qs.all():
                running_thread.append(threading.Thread(
                    target=self.MenteeNameQuery, args=(goal, query, id)))
            # start all thread
            for t in running_thread:
                t.start()
            # join
            for t in running_thread:
                t.join()
            return qs.filter(mentee_id__in=id)
        return qs

    def MenteeNameQuery(self, goal, query, id):
        mentee = goal.get_mentee()
        if mentee and query.lower() in (mentee['firstName'].lower()):
            id.append(goal.mentee_id)

    def perform_create(self, serializer):
        mentors = MentorUser.objects.filter(user_id=self.request.user.id)
        categories = self.request.data["categories"]
        if mentors is None:
            raise Http404()
        FluentLoggingHandler.info(
            f"{self.request.user} has created a new goal with the following categories: {categories}")
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
            categories = self.request.data["categories"]
            FluentLoggingHandler.info(
                f"{self.request.user} has updated a goal with the following categories: {categories}")
            return serializer.save(categories=self.request.data["categories"])
        else:
            FluentLoggingHandler.info(
                f"{self.request.user} has updated a goal")
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
        response = Response(result)
        FluentLoggingHandler.info(
            f"{self.request.user} is getting the following goal statistics: {result}")
        return result


# GET /api/goals/export/
class GoalExportsAPIView(MentorGoalQuerySetMixin, generics.GenericAPIView):
    queryset = Goal.objects.all()

    def get(self, request):
        all = self.get_queryset()
        cache = {}

        def get_mentee_name(goal):
            id = goal.mentee_id
            if id is None:
                FluentLoggingHandler.error(
                    f"{request.user} failed to get a mentee with id: {id}, this mentee does not exist")
                return None
            key = f"mentee-{id}"
            if key not in cache:
                mentee = goal.get_mentee()
                if mentee is None:
                    cache[key] = None
                cache[key] = f"{mentee['firstName']} {mentee['lastName']}"

            mentee = cache[f"mentee-{id}"]
            FluentLoggingHandler.info(
                f"{request.user} is getting the following mentee: {mentee} associated with this goal: {goal}")
            return cache[f"mentee-{id}"]

        def goal_to_csv_row(goal):
            FluentLoggingHandler.info(
                f"Transforming the following goal into a row for CSV file: {goal}")
            row = {}
            mentor = goal.mentor
            row["Mentor"] = mentor.user.email if mentor is not None else ""
            row["Title"] = goal.title
            row["Creation Date"] = goal.creation_date.strftime("%Y-%m-%d")
            row["Review Date"] = goal.goal_review_date.strftime("%Y-%m-%d")
            row["Last Update"] = goal.last_update_date.strftime("%Y-%m-%d")
            row["Status"] = goal.status
            row["Description"] = goal.description
            row["Categories"] = ", ".join(
                [category.name for category in goal.categories.iterator()])
            mentee = get_mentee_name(goal)
            row["Mentee"] = "" if mentee is None else mentee
            return row

        with io.StringIO() as csvFile:
            fieldsname = ["Mentor", "Mentee", "Title", "Creation Date",
                          "Review Date", "Last Update", "Status", "Description", "Categories"]
            writer = csv.DictWriter(
                csvFile, fieldnames=fieldsname, quoting=csv.QUOTE_ALL)

            writer.writeheader()
            for goal in all.iterator():
                row = goal_to_csv_row(goal)
                writer.writerow(row)

            response = Response(csvFile.getvalue())

            return response
