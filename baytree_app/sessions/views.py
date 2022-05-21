from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from users.permissions import AdminPermissions, userIsAdmin, userIsSuperUser
from users.models import MentorUser
from .permissions import *
from .constants import views_username, views_password, views_base_url
import requests
import re


from .models import Activity
from rest_framework import viewsets
from .serializers import ActivitySerializer

# Code adapted from https://www.django-rest-framework.org/tutorial/quickstart/
class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows activities to be viewed or edited.
    """

    queryset = Activity.objects.all().order_by("name")
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated & AdminPermissions]


class ViewsAppSessionView(APIView):
    permission_classes = [IsAuthenticated & (AdminPermissions | IsUserAMentor)]

    ### todo: SessionGroupID, Activity, VenueID are hardcoded need to be changed once admin page (creating mentor account) is completed

    def post(self, request):

        ############################
        # POST request for Session #
        ############################

        # Mentors can only create sessions for themselves or an admin
        if (
            int(request.data["LeadStaff"]) != request.user.id
            and not userIsAdmin(request.user)
            and not userIsSuperUser(request.user)
        ):
            return Response(
                {"errors": "You are not permitted to access this resource."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        mentorUser = MentorUser.objects.all().filter(user_id=request.data["LeadStaff"])

        mentorID = str(mentorUser[0].viewsPersonId)

        # NOTE: Activity, Session Group ID, VenueID is needed here

        viewSessionData = """<?xml version="1.0" encoding="utf-8"?>
                        <session id="">
                            <SessionGroupID>{0}</SessionGroupID>
                            <SessionType>Individual</SessionType>
                            <Name>Mentoring Session</Name>
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
            3,
            request.data["StartDate"],
            request.data["StartTime"],
            request.data["Duration"],
            request.data["CancelledSession"],
            "Budgeting",
            mentorID,
            2,
        )

        # NOTE: Session Group ID needed here

        session_url = views_base_url + "3/sessions"
        try:
            response = requests.post(
                session_url,
                data=viewSessionData,
                headers={"content-type": "text/xml"},
                auth=(views_username, views_password),
            )
            # getting session ID from response
            sessionID = response.text[
                (response.text.find("<SessionID>") + len("<SessionID>")) : (
                    response.text.find("</SessionID>")
                )
            ]

        except Exception as e:
            return Response(
                {"Error": "Making a post request for session failed!"}, status=400
            )

        #################################
        # POST request for Session Note #
        #################################

        viewNoteData = """<?xml version="1.0" encoding="utf-8"?>
                            <notes>
                                <Note>{0}</Note>
                            </notes>""".format(
            request.data["Notes"]
        )
        note_url = views_base_url + "sessions/" + sessionID + "/notes"
        try:
            response = requests.post(
                note_url,
                data=viewNoteData,
                headers={"content-type": "text/xml"},
                auth=(views_username, views_password),
            )
        except Exception as e:
            return Response(
                {"Error": "Making a post request for note failed!"}, status=400
            )

        ###########################
        # POST request for Mentor #
        ###########################

        viewMentorData = """<?xml version="1.0" encoding="utf-8"?>
                            <staff>
                                <ContactID>{0}</ContactID>
                                <Attended>{1}</Attended>
                                <Role>Lead</Role>
                                <Volunteering>Mentoring</Volunteering>
                            </staff>""".format(
            mentorID, request.data["CancelledAttendee"]
        )
        mentor_url = views_base_url + "sessions/" + sessionID + "/staff"
        try:
            response = requests.post(
                mentor_url,
                data=viewMentorData,
                headers={"content-type": "text/xml"},
                auth=(views_username, views_password),
            )
        except Exception as e:
            return Response(
                {"Error": "Making a post request for mentor failed!"}, status=400
            )

        ###########################
        # POST request for Mentee #
        ###########################

        # NOTE: Mentee ID is neede here

        viewMenteeData = """<?xml version="1.0" encoding="utf-8"?>
                            <participants>
                                <ContactID>{0}</ContactID>
                                <Attended>{1}</Attended>
                            </participants>""".format(
            4, request.data["CancelledAttendee"]
        )
        mentee_url = views_base_url + "sessions/" + sessionID + "/participants"
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
