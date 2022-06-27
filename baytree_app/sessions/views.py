from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from sessions.serializers import VenueSerializer
from sessions.models import Venue
from baytree_app.views import BatchRestViewSet
from users.permissions import AdminPermissions, userIsAdmin, userIsSuperUser
from users.models import MentorUser
from sessions.serializers import SessionSerializer
from sessions.models import MentorSession
from .permissions import *
from .constants import views_username, views_password, views_base_url
import requests
from users.models import MentorUser


# Based on https://medium.com/beyond-light-creations/build-a-rest-api-with-django-rest-framework-and-mysql-ddff0c1126ae#04e7


class SessionView(APIView):
    permission_classes = [(IsAuthenticated & (IsUserAMentor | AdminPermissions))]

    def get(self, request, id=None):
        if id:
            try:
                queryset = MentorSession.objects.get(id=id)

                # Only the mentor the session belongs to can access the session or an admin
                if (
                    queryset.mentor_id != request.user.id
                    and not userIsAdmin(request.user)
                    and not userIsSuperUser(request.user)
                ):
                    return Response(
                        {"errors": "You are not permitted to access this resource."},
                        status=status.HTTP_401_UNAUTHORIZED,
                    )

            except MentorSession.DoesNotExist:
                return Response({"errors": "This session does not exist."}, status=400)
            read_serializer = SessionSerializer(queryset)
        else:
            # Only admins can access all session information of all mentors at Baytree
            if not userIsAdmin(request.user) and not userIsSuperUser(request.user):
                return Response(
                    {"errors": "You are not permitted to access these resources"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            queryset = MentorSession.objects.all()
            read_serializer = SessionSerializer(queryset, many=True)
        return Response(read_serializer.data)

    def post(self, request):
        create_serializer = SessionSerializer(data=request.data)
        if create_serializer.is_valid():
            session_object = create_serializer.save()
            read_serializer = SessionSerializer(session_object)
            return Response(read_serializer.data, status=201)
        return Response(create_serializer.errors, status=400)

    def put(self, request, id=None):
        try:
            session = MentorSession.objects.get(id=id)

            # Only the mentor the session belongs to can access the session or an admin
            if (
                session.mentor_id != request.user.id
                and not userIsAdmin(request.user)
                and not userIsSuperUser(request.user)
            ):
                return Response(
                    {"errors": "You are not permitted to access this resource."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

        except MentorSession.DoesNotExist:
            return Response({"errors": "This session does not exist."}, status=400)
        update_serializer = SessionSerializer(session, data=request.data)

        if update_serializer.is_valid():
            session_object = update_serializer.save()
            read_serializer = SessionSerializer(session_object)
            return Response(read_serializer.data, status=200)
        return Response(update_serializer.errors, status=400)

    def delete(self, request, id=None):
        try:
            session = MentorSession.objects.get(id=id)

            # Only the mentor the session belongs to can access the session or an admin
            if (
                session.mentor_id != request.user.id
                and not userIsAdmin(request.user)
                and not userIsSuperUser(request.user)
            ):
                return Response(
                    {"errors": "You are not permitted to access this resource."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

        except MentorSession.DoesNotExist:
            return Response({"errors": "This session does not exist."}, status=400)

        session.delete()

        return Response(status=204)


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


class VenueViewSet(BatchRestViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer
    model_class = Venue

    def get_permissions(self):
        if (
            self.action == "create"
            or self.action == "update"
            or self.action == "partial_update"
            or self.action == "destroy"
        ):
            permission_classes = [IsAuthenticated & AdminPermissions]
        elif self.action == "list" or self.action == "retrieve":
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]
