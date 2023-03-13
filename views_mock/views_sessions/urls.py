from django.urls import path

from .views import GetSingleSession

urlpatterns = [
    path("sessions/<int:session_id>/", GetSingleSession.as_view(), name="get-single-session")
]