from django.urls import path

from .views import (
    GoalListCreateAPIView,
    GoalRetrieveUpdateDestroyAPIView
)

urlpatterns = [
    path('', GoalListCreateAPIView.as_view()),
    path('/<int:pk>/', GoalRetrieveUpdateDestroyAPIView.as_view())
]