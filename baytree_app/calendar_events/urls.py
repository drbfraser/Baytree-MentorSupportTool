from django.urls import path

from .views import (
  CalendarEventListAPIView,
  CalendarEventCreateAPIView,
  CalendarEventUpdateDestroyAPIVIew
)

# /api/calendar_events/
urlpatterns = [
  path('', CalendarEventListAPIView.as_view()),
  path('create/', CalendarEventCreateAPIView.as_view()),
  path('<int:pk>/', CalendarEventUpdateDestroyAPIVIew.as_view()),
]