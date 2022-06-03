from django.urls import path

from .volunteeringTypes import get_volunteering_types_endpoint
from .venues import get_venues_endpoint
from .activities import get_activities_endpoint
from .associations import get_associations_endpoint
from .questionnaires import get_questionnaires_endpoint
from .participants import get_participants_endpoint
from .volunteers import get_volunteers_endpoint
from .session_groups import get_session_groups_endpoint
from .sessions import get_sessions_endpoint, post_session

urlpatterns = [
    path("session-groups", get_session_groups_endpoint),
    path("sessions", post_session),
    path("sessions", get_sessions_endpoint),
    path("volunteers", get_volunteers_endpoint),
    path("participants", get_participants_endpoint),
    path("questionnaires", get_questionnaires_endpoint),
    path("associations", get_associations_endpoint),
    path("activities", get_activities_endpoint),
    path("volunteering-types", get_volunteering_types_endpoint),
    path("venues", get_venues_endpoint),
]
