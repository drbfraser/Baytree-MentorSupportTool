from django.urls import path

from .views import MentorViews

urlpatterns = [
    path('mentors/<int:id>', MentorViews.as_view())
]