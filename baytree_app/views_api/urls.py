from django.urls import path

from .participants import get_participants_endpoint
from .volunteers import get_volunteers_endpoint, get_participant_by_volunteer
from .session_groups import get_session_groups_endpoint
from .sessions import get_sessions_endpoint

urlpatterns = [
    path('session-groups', get_session_groups_endpoint),
    path('sessions', get_sessions_endpoint),
    path('volunteers', get_volunteers_endpoint),
    path('volunteers/participants/', get_participant_by_volunteer),
    path('participants', get_participants_endpoint)
]
