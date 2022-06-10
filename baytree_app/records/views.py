from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.models import MentorUser
from users.permissions import userIsAdmin, userIsSuperUser
from views_api.session_groups import get_session_groups
from views_api.sessions import (get_mentee_from_session_by_id,
                                get_note_from_session_by_id, get_sessions)
from views_api.volunteers import get_volunteers

# Query params
queryKeys = ["sessionGroupId", "limit", "offset", "startDateFrom", "startDateTo"]

# GET /api/records
@api_view(("GET", ))
def get_sessions_by_volunteer(request):
    """
    Fetch all the sessions hosted by the requesting mentor
    """
    mentors = MentorUser.objects.filter(user_id=request.user.id)
    if not mentors:
        return Response(status=status.HTTP_404_NOT_FOUND)
    params = { key: request.GET.get(key, None) for key in queryKeys }
    params["personId"] = mentors.first().viewsPersonId
    sessions = get_sessions(**params)
    return Response(sessions, status=status.HTTP_200_OK)

# GET /api/records/<session_id>/
@api_view(("GET", ))
def get_session_by_id(request, id=None):
    """
    Fetch all detail of a session by its id
    """
    if id is None: return Response(status=status.HTTP_404_NOT_FOUND)

    # Fetch the session by the id
    session = get_sessions(id)
    if session is None: return Response(status=status.HTTP_404_NOT_FOUND)

    # Check the ownership
    user = request.user
    mentors = MentorUser.objects.filter(viewsPersonId=str(session["leadStaff"]))
    if not userIsAdmin(user) and not userIsSuperUser(user):
        mentors = mentors.filter(user_id=user.id)
        if not mentors: return Response(status=status.HTTP_403_FORBIDDEN)

    # Fetch the detailed session group
    session["sessionGroup"] = get_session_groups(session["viewsSessionGroupId"])
    session["mentor"] = None
    session["mentee"] = get_mentee_from_session_by_id(id)
    session["note"] = get_note_from_session_by_id(id)

    # Fetch a single mentor
    mentors = get_volunteers(session["leadStaff"])
    if mentors["total"] > 0:
        session["mentor"] = mentors["data"][0]

    return Response(session, status=status.HTTP_200_OK)
