from django.urls import path
from .views import MentorStatsViews

urlpatterns = [
    path('', MentorStatsViews.as_view()),
    path('<int:id>', MentorStatsViews.as_view())
]