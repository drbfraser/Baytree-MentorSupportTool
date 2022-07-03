from django.urls import path

from .views import LoggingViews

# /api/logging/
urlpatterns = [
    path('', LoggingViews.as_view())
]