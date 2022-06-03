from rest_framework.response import Response
from views_api.associations import get_associations
from users.models import MentorRole
from users.models import MentorUser

from sessions.permissions import userIsAdmin, userIsSuperUser
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
    "VenueName",
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
    "venueName",
]

"""
WHAT IS A SESSION:
For Baytree's use case of the Views API, Sessions in their Views database hold
recorded information about a mentoring session that transpired between a Mentor and their Mentee.
Mentors can take notes and attach these as "Session Notes" in views to a particular session.
Mentors can also take note of attendance by attaching "Session Attendance" in views to a
particular session.
"""


@api_view(("POST",))
def post_session(request):
    ### todo: SessionGroupID, Activity, VenueID are hardcoded need to be changed once admin page (creating mentor account) is completed
    ############################
    # POST request for Session #
    ############################

    if "startDate" not in request.data:
        return Response(
            {"errors": "startDate must be provided."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if "startTime" not in request.data:
        return Response(
            {"errors": "startTime must be provided."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if "duration" not in request.data:
        return Response(
            {"errors": "duration must be provided."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if "viewsVenueId" not in request.data:
        return Response(
            {"errors": "viewsVenueId must be provided."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    start_date = request.data["startDate"]
    start_time = request.data["startTime"]
    duration = request.data["duration"]
    views_venue_id = request.data["viewsVenueId"]

    # Get mentor user object
    mentor_user = MentorUser.objects.all().filter(pk=request.user.id)
    if not mentor_user.exists():
        return Response(
            {"errors": "The current user creating a session is not a mentor!"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    mentor_user = mentor_user.first()

    # Get mentor's mentor role
    mentor_role = mentor_user.mentorRole

    # Get mentee views person id (either in params or from views associations)
    mentee_views_person_id = (
        request.data["menteeViewsPersonId"]
        if hasattr(request.data, "menteeViewsPersonId")
        else None
    )

    # get first associated mentee for mentor if not provided in request body
    if not mentee_views_person_id:
        associations = get_associations(mentor_user.viewsPersonId)
        mentee_association = next(
            filter(lambda a: a["association"] == "Mentee", associations["results"]),
            None,
        )

        if not mentee_association:
            return Response(
                {"Error": "A mentee is not associated with the mentor!"}, status=400
            )

        mentee_views_person_id = mentee_association["masterId"]

    viewSessionData = """<?xml version="1.0" encoding="utf-8"?>
                    <session id="">
                        <AssociateWithSessionGroup>Yes</AssociateWithSessionGroup>
                        <SessionGroupID>{0}</SessionGroupID>
                        <SessionType>121</SessionType>
                        <Name>121 Session</Name>
                        <StartDate>{1}</StartDate>
                        <StartTime>{2}</StartTime>
                        <Duration>{3}</Duration>
                        <Cancelled>{4}</Cancelled>
                        <Activity>{5}</Activity>
                        <LeadStaff>{6}</LeadStaff>
                        <VenueID>{7}</VenueID>
                        <RestrictedRecord>0</RestrictedRecord>
                        <ContactType>Individual</ContactType>
                    </session>""".format(
        mentor_role.viewsSessionGroupId,
        start_date,
        start_time,
        duration,
        0,
        mentor_role.activity,
        mentor_user.viewsPersonId,
        views_venue_id,
    )

    session_url = views_base_url + "work/sessiongroups/{}/sessions".format(
        mentor_role.viewsSessionGroupId
    )
    try:
        response = requests.post(
            session_url,
            data=viewSessionData,
            headers={"content-type": "text/xml"},
            auth=(views_username, views_password),
        )

        if response.status_code != 200:
            return Response(
                {"Error": "Making a post request for session failed!"},
                status=response.status_code,
            )

        # getting session ID from response
        session_id = response.text[
            (response.text.find("<SessionID>") + len("<SessionID>")) : (
                response.text.find("</SessionID>")
            )
        ]

    except Exception as e:
        return Response(
            {"Error": "Making a post request for session failed!"}, status=500
        )

    #################################
    # POST request for Session Note #
    #################################

    if "notes" in request.data:
        viewNoteData = """<?xml version="1.0" encoding="utf-8"?>
                            <notes>
                                <Note>{0}</Note>
                            </notes>""".format(
            request.data["notes"]
        )

        note_url = views_base_url + "work/sessiongroups/sessions/{}/notes".format(
            session_id
        )
        try:
            response = requests.post(
                note_url,
                data=viewNoteData,
                headers={"content-type": "text/xml"},
                auth=(views_username, views_password),
            )
        except Exception as e:
            return Response(
                {"Error": "Making a post request for note failed!"}, status=500
            )

    ###########################
    # POST request for Mentor #
    ###########################

    viewMentorData = """<?xml version="1.0" encoding="utf-8"?>
                        <staff>
                            <ContactID>{0}</ContactID>
                            <Attended>{1}</Attended>
                            <Role>Lead</Role>
                            <Volunteering>{2}</Volunteering>
                        </staff>""".format(
        mentor_user.viewsPersonId, 1, mentor_role.volunteeringType
    )
    mentor_url = views_base_url + "work/sessiongroups/sessions/{}/staff".format(
        session_id
    )

    try:
        response = requests.post(
            mentor_url,
            data=viewMentorData,
            headers={"content-type": "text/xml"},
            auth=(views_username, views_password),
        )
    except Exception as e:
        return Response(
            {"Error": "Making a post request for mentor failed!"}, status=500
        )

    ###########################
    # POST request for Mentee #
    ###########################

    viewMenteeData = """<?xml version="1.0" encoding="utf-8"?>
                        <participants>
                            <ContactID>{0}</ContactID>
                            <Attended>{1}</Attended>
                        </participants>""".format(
        mentee_views_person_id, 1
    )
    mentee_url = views_base_url + "work/sessiongroups/sessions/{}/participants".format(
        session_id
    )
    try:
        response = requests.post(
            mentee_url,
            data=viewMenteeData,
            headers={"content-type": "text/xml"},
            auth=(views_username, views_password),
        )
    except Exception as e:
        return Response(
            {"Error": "Making a post request for mentee failed!"}, status=400
        )

    return Response(response, status=200)


def get_sessions(
    id: str = None,
    session_group_id: str = None,
    limit: int = None,
    offset: int = None,
    startDateFrom: str = None,
    startDateTo: str = None,
):
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
        response = requests.get(
            sessions_base_url.format(session_group_id) + "/" + id,
            auth=(views_username, views_password),
        )
        parsed = xmltodict.parse(response.text)
        session = {
            session_translated_fields[i]: parsed["session"][field]
            for i, field in enumerate(session_views_response_fields)
        }
        return session
    else:
        if limit != None and offset != None:
            request_url = (
                sessions_base_url.format(session_group_id)
                + "?pageFold="
                + str(limit)
                + "&offset="
                + str(offset)
            )

            if startDateFrom != None:
                request_url += "&StartDate-from={}".format(startDateFrom)
            if startDateTo != None:
                request_url += "&StartDate-to={}".format(startDateTo)

            response = requests.get(
                request_url,
                auth=(views_username, views_password),
            )
        else:
            request_url = sessions_base_url.format(session_group_id) + "?"

            if startDateFrom != None:
                request_url += "&StartDate-from={}".format(startDateFrom)
            if startDateTo != None:
                request_url += "&StartDate-to={}".format(startDateTo)

            response = requests.get(
                request_url,
                auth=(views_username, views_password),
            )

        parsed = xmltodict.parse(response.text)

        # Handle edge case where no sessions were returned from views
        if parsed["sessions"]["@count"] == "0":
            return {"total": parsed["sessions"]["@count"], "data": []}

        parsed_session_list = parsed["sessions"]["session"]
        if not isinstance(parsed_session_list, list):
            parsed_session_list = [parsed_session_list]

        sessions = [
            {
                session_translated_fields[i]: session[field]
                for i, field in enumerate(session_views_response_fields)
            }
            for session in parsed_session_list
        ]
        return {"total": parsed["sessions"]["@count"], "data": sessions}


@api_view(("GET",))
@permission_classes((AdminPermissions,))
def get_sessions_endpoint(request):
    """
    Handles a request from the client browser and calls get_sessions()
    to return its response to the client.
    """
    id = request.GET.get("id", None)
    session_group_id = request.GET.get("sessionGroupId", None)
    if id != None and session_group_id != None:
        response = get_sessions(id, session_group_id=session_group_id)
    elif session_group_id != None:
        response = get_sessions(
            session_group_id=session_group_id,
            limit=request.GET.get("limit", None),
            offset=request.GET.get("offset", None),
            startDateFrom=request.GET.get("startDateFrom", None),
            startDateTo=request.GET.get("startDateTo", None),
        )
    else:
        return Response(
            {"error": "A session group ID must be provided"}, status=status.HTTP_200_OK
        )

    return Response(response, status=status.HTTP_200_OK)
