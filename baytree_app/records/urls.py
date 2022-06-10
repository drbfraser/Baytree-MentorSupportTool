from django.urls import path
from .views import get_sessions_by_volunteer, get_session_by_id

urlpatterns = [
    path('', get_sessions_by_volunteer),
    path('<int:id>/', get_session_by_id)
]
