from django.urls import path

from .views import (
    GoalListCreateAPIView,
    GoalOPtionsListView,
    GoalRetrieveUpdateDestroyAPIView
)

urlpatterns = [
    path('', GoalListCreateAPIView.as_view()),
    path('/<int:pk>/', GoalRetrieveUpdateDestroyAPIView.as_view()),
    path('/options/', GoalOPtionsListView.as_view())
]