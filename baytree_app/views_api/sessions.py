import requests
import xmltodict
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from views_api.session_groups import get_session_groups
from users.models import MentorUser
from users.permissions import userIsAdmin, userIsSuperUser
from .volunteers import get_volunteers
from .util import get_sessions, get_volunteers
from .constants import sessions_base_url


from views_api.associations import get_associations

from .constants import views_base_url, views_password, views_username
from .util import try_parse_int

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

        if id != None and sessionGroupId != None:
            if not userIsAdmin(request.user) and (
                not mentor_user.exists() or mentor_user.first().viewsPersonId != id
            ):
                return Response(
                    "You do not have permission to access this resource", 401
                )

            response = get_sessions(id, sessionGroupId=sessionGroupId)

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

        start_date = request.data["startDate"]
        start_time = request.data["startTime"]
        duration = request.data["duration"]
        views_venue_id = request.data["viewsVenueId"]

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

        ############################
        # POST request for Session #
        ############################

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
        mentee_url = (
            views_base_url
            + "work/sessiongroups/sessions/{}/participants".format(session_id)
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

        return Response({"sessionId": try_parse_int(session_id)}, status=200)


# GET /api/views-api/sessions/<session_id>
@api_view(("GET", ))
def get_session_by_id(request, id = None):
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

def get_mentee_from_session_by_id(id):
    url = f"{sessions_base_url}/{id}/participants"
    response = requests.get(url, auth=(views_username, views_password))
    if response.status_code != 200: return None
    parsed_mentee = xmltodict.parse(response.content)
    parsed_mentee = parsed_mentee["session"]["participants"]["participant"]
    return {
        "menteeId": parsed_mentee["@id"],
        "name": parsed_mentee["Name"]
    }

def get_note_from_session_by_id(id):
    url = f"{sessions_base_url}/{id}/notes"
    response = requests.get(url, auth=(views_username, views_password))
    if response.status_code != 200: return None
    parsed_mentee = xmltodict.parse(response.content)
    parsed_mentee = parsed_mentee["session"]["notes"]["note"]
    return parsed_mentee["Note"]