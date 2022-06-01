from django.urls import path

from .views import (
  HolidayListAPIView,
  HolidayCreateAPIView,
  HolidayUpdateDestroyAPIVIew
)

# /api/holidays/
urlpatterns = [
  path('', HolidayListAPIView.as_view()),
  path('create/', HolidayCreateAPIView.as_view()),
  path('<int:pk>/', HolidayUpdateDestroyAPIVIew.as_view()),
]