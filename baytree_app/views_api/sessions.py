from rest_framework.response import Response
from .constants import views_base_url, views_username, views_password
from rest_framework.decorators import permission_classes, api_view
from rest_framework import status
from users.permissions import AdminPermissions
import requests
import xmltodict

sessions_base_url = views_base_url + "work/sessiongroups/{}/sessions"

session_views_response_fields = [
    "SessionID",
    "SessionGroupID",
    "Name",
    "StartDate",
    "StartTime",
    "Duration",
    "Cancelled",
    "Activity",
    "LeadStaff",
    "VenueID",
    "Created",
    "Updated",
    "VenueName"
]
session_translated_fields = [
    "viewsSessionId",
    "viewsSessionGroupId",
    "name",
    "startDate",
    "startTime",
    "duration",
    "cancelled",
    "activity",
    "leadStaff",
    "venueId",
    "created",
    "updated",
    "venueName"
]

def get_sessions(id: str = None, session_group_id: str = None, limit: int = None, offset: int = None):
    """
    Gets sessions from Views API.
    If an id argument is provided, the session with a matching id will be returned.
    The limit and offset parameters are used to implement pagination.
    The limit parameter determines how many sessions to return from the Views API.
    The offset parameter determines which session to start at when asking for
    a number of sessions from Views when using the limit parameter.
    So, if limit = 5 and offset = 5, this would say: "give me 5 sessions,
    but skip the first 5 in the total sessions returned by the Views API."
    """

    if id != None and session_group_id != None:
        response = requests.get(sessions_base_url.format(session_group_id) + "/" + id, auth=(views_username, views_password))
        parsed = xmltodict.parse(response.text)
        session = {session_translated_fields[i]: parsed["session"][field]
                     for i, field in enumerate(session_views_response_fields)}
        return session
    else:
        if limit != None and offset != None:
            response = requests.get(
                sessions_base_url.format(session_group_id) + "?pageFold=" +
                str(limit) + "&offset=" + str(offset),
                auth=(views_username, views_password))
        else:
            response = requests.get(
                sessions_base_url.format(session_group_id),
                auth=(views_username, views_password))
        
        parsed = xmltodict.parse(response.text)
        parsed_session_list = parsed["sessions"]["session"]
        if not isinstance(parsed_session_list, list):
            parsed_session_list = [parsed_session_list]

        sessions = [{session_translated_fields[i]: session[field] for i, field in enumerate(session_views_response_fields)}
                      for session in parsed_session_list]
        return {"total": parsed['sessions']['@count'], "data": sessions}

@api_view(('GET',))
@permission_classes((AdminPermissions, ))
def get_sessions_endpoint(request):
    """
    Handles a request from the client browser and calls get_session_groups
    to return its response to the client.
    """
    id = request.GET.get('id', None)
    session_group_id = request.GET.get('sessionGroupId', None)

    if id != None and session_group_id != None:
        response = get_sessions(id, session_group_id=session_group_id)
    elif session_group_id != None:
        response = get_sessions(session_group_id=session_group_id, limit=request.GET.get(
            'limit', None), offset=request.GET.get('offset', None))
    else:
        return Response({"error": "A session group ID must be provided"}, status=status.HTTP_200_OK)

    return Response(response, status=status.HTTP_200_OK)