from django.urls import path

from .views import MentorViews, StatisticViews

urlpatterns = [
    path('mentors/<int:id>', MentorViews.as_view()),
    path('statistics/<type>/<int:id>', StatisticViews.as_view())
]
