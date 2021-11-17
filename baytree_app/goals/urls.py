from django.urls import path

from .views import GoalViews

urlpatterns = [
    path('goal/', GoalViews.as_view()),
    path('goal/<int:id>', GoalViews.as_view())
]