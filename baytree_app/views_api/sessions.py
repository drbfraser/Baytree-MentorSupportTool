import requests
import xmltodict
from baytree_app.constants import (VIEWS_BASE_URL, VIEWS_PASSWORD,
                                   VIEWS_USERNAME)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from users.models import MentorUser
from users.permissions import userIsAdmin

from views_api.associations import get_associations

from .util import try_parse_int

sessions_base_url = VIEWS_BASE_URL + "work/sessiongroups/sessions"
sessions_base_url_by_group = VIEWS_BASE_URL + "work/sessiongroups/{}/sessions"

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

# GET, POST /api/views-api/sessions
class SessionsApiView(APIView):
    def get(self, request):
        """
        Handles a request from the client browser and calls get_sessions()
        to return its response to the client.
        """
        id = request.GET.get("id", None)
        sessionGroupId = request.GET.get("sessionGroupId", None)
        mentor_user = MentorUser.objects.filter(pk=request.user.id)

        if id != None:
            if not userIsAdmin(request.user) and (
                not mentor_user.exists() or mentor_user.first().viewsPersonId != id
            ):
                return Response(
                    "You do not have permission to access this resource", 401
                )

            response = get_session(id)

        elif sessionGroupId != None:
            if not userIsAdmin(request.user) and not mentor_user.exists():
                return Response(
                    "You do not have permission to access this resource", 401
                )

            response = get_sessions(
                sessionGroupId=sessionGroupId,
                limit=request.GET.get("limit", None),
                offset=request.GET.get("offset", None),
                startDateFrom=request.GET.get("startDateFrom", None),
                startDateTo=request.GET.get("startDateTo", None),
                personId=mentor_user.first().viewsPersonId
                if mentor_user.exists()
                else None,
            )
        else:
            return Response(
                {"error": "A session group ID must be provided"},
                status=status.HTTP_200_OK,
            )

        return Response(response, status=status.HTTP_200_OK)

    def post(self, request):
        # Get mentor user object
        mentor_user = MentorUser.objects.all().filter(pk=request.user.id)
        if not mentor_user.exists():
            return Response(
                {"errors": "The current user creating a session is not a mentor!"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        mentor_user = mentor_user.first()

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

        if "activity" not in request.data:
            return Response(
                {"errors": "activity must be provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        start_date = request.data["startDate"]
        start_time = request.data["startTime"]
        duration = request.data["duration"]
        views_venue_id = request.data["viewsVenueId"]
        activity = request.data["activity"]

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
            activity,
            mentor_user.viewsPersonId,
            views_venue_id,
        )

        ############################
        # POST request for Session #
        ############################

        session_url = VIEWS_BASE_URL + "work/sessiongroups/{}/sessions".format(
            mentor_role.viewsSessionGroupId
        )
        try:
            response = requests.post(
                session_url,
                data=viewSessionData,
                headers={"content-type": "text/xml"},
                auth=(VIEWS_USERNAME, VIEWS_PASSWORD),
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

            note_url = VIEWS_BASE_URL + "work/sessiongroups/sessions/{}/notes".format(
                session_id
            )
            try:
                response = requests.post(
                    note_url,
                    data=viewNoteData,
                    headers={"content-type": "text/xml"},
                    auth=(VIEWS_USERNAME, VIEWS_PASSWORD),
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
        mentor_url = VIEWS_BASE_URL + "work/sessiongroups/sessions/{}/staff".format(
            session_id
        )

        try:
            response = requests.post(
                mentor_url,
                data=viewMentorData,
                headers={"content-type": "text/xml"},
                auth=(VIEWS_USERNAME, VIEWS_PASSWORD),
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
        mentee_url = (
            VIEWS_BASE_URL
            + "work/sessiongroups/sessions/{}/participants".format(session_id)
        )
        try:
            response = requests.post(
                mentee_url,
                data=viewMenteeData,
                headers={"content-type": "text/xml"},
                auth=(VIEWS_USERNAME, VIEWS_PASSWORD),
            )
        except Exception as e:
            return Response(
                {"Error": "Making a post request for mentee failed!"}, status=400
            )

        return Response({"sessionId": try_parse_int(session_id)}, status=200)

def get_session(id: str):
    """
    Gets a session from Views API by its id.
    """
    response = requests.get(
            f"{sessions_base_url}/{id}",
            auth=(VIEWS_USERNAME, VIEWS_PASSWORD),
        )

    if response.status_code != 200: return None

    parsed = xmltodict.parse(response.text)
    session = {
        session_translated_fields[i]: parsed["session"][field]
        for i, field in enumerate(session_views_response_fields)
    }
    return session


def get_sessions(
    sessionGroupId: str = None,
    limit: int = None,
    offset: int = None,
    startDateFrom: str = None,
    startDateTo: str = None,
    personId=None,
    descendingDate=False
):
    """
    Gets sessions from Views API.
    The limit and offset parameters are used to implement pagination.
    The limit parameter determines how many sessions to return from the Views API.
    The offset parameter determines which session to start at when asking for
    a number of sessions from Views when using the limit parameter.
    So, if limit = 5 and offset = 5, this would say: "give me 5 sessions,
    but skip the first 5 in the total sessions returned by the Views API."
    """
    request_url = f"{sessions_base_url}/search" if sessionGroupId is None else sessions_base_url_by_group.format(sessionGroupId)
    params = {}
    if limit != None: params["pageFold"] = limit
    if offset != None: params["offset"] = offset
    if startDateFrom != None: params["StartDate-from"] = startDateFrom
    if startDateTo != None: params["StartDate-to"] = startDateTo
    if personId != None: params["LeadStaff"] = personId

    # In the case of requesting in reversed order with pagination
    # Process the limit and offset params before sending to Views
    if descendingDate and limit is not None:
        # Dummy API call to get the total number of records
        dummyParams = params.copy()
        dummyParams["pageFold"] = 1
        dummyParams["offset"] = 0
        dummyResponse = requests.get(
            request_url,
            params=dummyParams,
            auth=(VIEWS_USERNAME, VIEWS_PASSWORD),
        )
        if dummyResponse.status_code != 200: return None
        parsed = xmltodict.parse(dummyResponse.text)
        count = int(parsed["sessions"]["@count"])

        # Process limit and offset before sending to view API
        limit = int(limit)
        if offset is None: offset = 0
        else: offset = int(offset)
        offset = count - (offset + limit)
        if offset < 0:
            limit = limit + offset
            offset = 0
        if limit <= 0:
            return {"count": count, "results": []}
        params["pageFold"] = limit
        params["offset"] = offset

    # Real API call to Views
    # The sessions is always sorted by creation date in ascending order
    response = requests.get(
        request_url,
        params=params,
        auth=(VIEWS_USERNAME, VIEWS_PASSWORD),
    )

    if response.status_code != 200: return None

    parsed = xmltodict.parse(response.text)

    # Handle edge case where no sessions were returned from views
    if parsed["sessions"]["@count"] == "0":
        return {"count": 0, "results": []}

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
    
    if descendingDate: sessions.reverse()

    return {"count": int(parsed["sessions"]["@count"]), "results": sessions}


def get_mentee_from_session_by_id(id):
    url = f"{sessions_base_url}/{id}/participants"
    response = requests.get(url, auth=(VIEWS_USERNAME, VIEWS_PASSWORD))
    if response.status_code != 200: return None
    parsed_mentee = xmltodict.parse(response.content)
    parsed_mentee = parsed_mentee["session"]["participants"]
    if parsed_mentee is None: return None
    parsed_mentee = parsed_mentee["participant"]
    return {
        "menteeId": parsed_mentee["@id"],
        "name": parsed_mentee["Name"]
    }

def get_note_from_session_by_id(id):
    url = f"{sessions_base_url}/{id}/notes"
    response = requests.get(url, auth=(VIEWS_USERNAME, VIEWS_PASSWORD))
    if response.status_code != 200: return None
    parsed_note = xmltodict.parse(response.content)
    parsed_note = parsed_note["session"]["notes"]
    if parsed_note is None: return None
    parsed_note = parsed_note["note"]
    return parsed_note["Note"]

def update_session_note_by_session_id(session_id, note):
    xmlData = (
        "<notes>"
            f"<Note>{note}</Note>"
        "</notes>"
    )
    url = f"{sessions_base_url}/{session_id}/notes"
    # Check if the note exists
    response = requests.get(url, auth=(VIEWS_USERNAME, VIEWS_PASSWORD))
    parsed = xmltodict.parse(response.text)
    notes = parsed["session"]["notes"]
    if notes is None:
        response = requests.post(
            url, 
            xmlData, 
            auth=(VIEWS_USERNAME, VIEWS_PASSWORD), 
            headers={"content-type": "text/xml"})
    else:
        noteId = notes["note"]["@id"]
        response = requests.put(
            f"{url}/{noteId}",
            xmlData,
            auth=(VIEWS_USERNAME, VIEWS_PASSWORD),
            headers={"content-type": "text/xml"})
    if response.status_code != 200: return False
    parsed = xmltodict.parse(response.text)
    noteId = parsed["note"]["@id"]
    return int(noteId) != 0

