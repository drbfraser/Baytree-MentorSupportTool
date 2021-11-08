from django.urls import path

from .views import GoalViews

urlpatterns = [
    path('', GoalViews.as_view())
]