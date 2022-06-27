from django.urls import path
from .views import submit_log

# /api/logging/
urlpatterns = [
    path('logging/', submit_log)
]