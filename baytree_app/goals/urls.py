from django.urls import path

from .views import (
    GoalListCreateAPIView,
    GoalCategoryListView,
    GoalRetrieveUpdateDestroyAPIView,
    GoalStatisticsAPIView
)

urlpatterns = [
    path('', GoalListCreateAPIView.as_view()),
    path('/<int:pk>/', GoalRetrieveUpdateDestroyAPIView.as_view()),
    path('/categories/', GoalCategoryListView.as_view()),
    path('/statistics/', GoalStatisticsAPIView.as_view())
]