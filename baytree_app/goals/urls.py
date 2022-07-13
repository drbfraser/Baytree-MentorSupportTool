from django.urls import path

from .views import (
    GoalListCreateAPIView,
    GoalCategoryListView,
    GoalRetrieveUpdateDestroyAPIView
)

urlpatterns = [
    path('', GoalListCreateAPIView.as_view()),
    path('/<int:pk>/', GoalRetrieveUpdateDestroyAPIView.as_view()),
    path('/categories/', GoalCategoryListView.as_view())
]