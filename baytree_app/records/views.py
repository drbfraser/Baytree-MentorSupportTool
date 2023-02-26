from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.models import MentorUser
from users.permissions import userIsAdmin, userIsSuperUser
from views_api.session_groups import get_session_groups
from views_api.sessions import (get_mentee_from_session_by_id,
                                get_note_from_session_by_id, get_session,
                                get_sessions,
                                update_session_note_by_session_id)
from views_api.volunteers import get_volunteers


# Check the ownership of a session
def is_owner(session, user):
    mentors = MentorUser.objects.filter(viewsPersonId=str(session["leadStaff"]))
    if not userIsAdmin(user) and not userIsSuperUser(user):
        mentors = mentors.filter(user_id=user.id)
        if not mentors: return False
    return True

# Query params
queryKeys = ["sessionGroupId", "limit", "offset", "startDateFrom", "startDateTo"]

# GET /api/records/
@api_view(("GET", ))
def get_sessions_by_volunteer(request, headers):
    """
    Fetch all the sessions hosted by the requesting mentor
    """
    mentors = MentorUser.objects.filter(user_id=request.user.id)
    if not mentors:
        return Response(status=status.HTTP_404_NOT_FOUND)
    params = { key: request.GET.get(key, None) for key in queryKeys }
    params["personId"] = mentors.first().viewsPersonId
    params["descendingDate"] = request.GET.get("descendingDate", None) == "1"
    sessions = get_sessions(**params, headers=headers)
    return Response(sessions, status=status.HTTP_200_OK)

# GET /api/records/stats/
WEEK_PER_YEAR = 52

@api_view(("GET", ))
def get_sessions_stats(request, headers):
    mentors = MentorUser.objects.filter(user_id=request.user.id)
    if not mentors:
        return Response(status=status.HTTP_404_NOT_FOUND)
    sessions = get_sessions(personId=mentors.first().viewsPersonId, headers=headers)
    results = sessions["results"]

    data = {
        "sessions_total": sessions["count"],
        "sessions_attended": len([s for s in results if s["cancelled"] == "0"]),
        "sessions_missed": len([s for s in results if s["cancelled"] == "1"]),
        "sessions_remaining": WEEK_PER_YEAR - sessions["count"]
    }
    return Response(data)


# GET /api/records/<session_id>/
@api_view(("GET", ))
def get_session_by_id(request, headers, id=None):
    """
    Fetch all detail of a session by its id
    """
    if id is None: return Response(status=status.HTTP_400_BAD_REQUEST)

    # Fetch the session by the id
    session = get_session(id, headers)
    if session is None: return Response(status=status.HTTP_404_NOT_FOUND)

    if not is_owner(session, request.user):
        return Response(status=status.HTTP_403_FORBIDDEN)

    # Fetch the detailed session group
    session["sessionGroup"] = get_session_groups(session["viewsSessionGroupId"])
    session["mentor"] = None
    session["mentee"] = get_mentee_from_session_by_id(id, headers)
    session["note"] = get_note_from_session_by_id(id, headers)

    # Fetch a single mentor
    mentors = get_volunteers(session["leadStaff"])
    if mentors["total"] > 0:
        session["mentor"] = mentors["data"][0]

    return Response(session, status=status.HTTP_200_OK)

# PUT /api/records/<session_id>/notes/
@api_view(("PUT", ))
def update_session_note(request, headers, id=None ):
    """
    Update the session note of a session by its session ID
    """
    if id is None: return Response(status=status.HTTP_400_BAD_REQUEST)

    # Fetch the session by the id
    session = get_session(id, headers)
    if session is None: return Response(status=status.HTTP_404_NOT_FOUND)

    # Check the ownership
    if not is_owner(session, request.user):
        return Response(status=status.HTTP_403_FORBIDDEN)

    # Update the note
    note = request.data.get("note", "")
    if not note.strip(): return Response(status=status.HTTP_400_BAD_REQUEST)
    success = update_session_note_by_session_id(id, headers, note)
    statusCode = status.HTTP_200_OK if success else status.HTTP_500_INTERNAL_SERVER_ERROR
    return Response(status=statusCode)

