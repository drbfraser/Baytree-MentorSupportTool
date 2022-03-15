from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MentorSession
from .serializers import SessionSerializer
from .permissions import *
from .constants import views_username, views_password, views_base_url
import requests
import re


# Based on https://medium.com/beyond-light-creations/build-a-rest-api-with-django-rest-framework-and-mysql-ddff0c1126ae#04e7

class SessionView(APIView):
    permission_classes = [IsOwner]

    def get(self, request, id=None):
        if id:
            try:
                queryset = MentorSession.objects.get(id=id)
            except MentorSession.DoesNotExist:
                return Response({'errors': 'This session does not exist.'}, status=400)
            read_serializer = SessionSerializer(queryset)
        else:
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
        except MentorSession.DoesNotExist:
            return Response({'errors': 'This session does not exist.'}, status=400)
        update_serializer = SessionSerializer(session, data=request.data)

        if update_serializer.is_valid():
            session_object = update_serializer.save()
            read_serializer = SessionSerializer(session_object)
            return Response(read_serializer.data, status=200)
        return Response(update_serializer.errors, status=400)

    def delete(self, request, id=None):
        try:
            session = MentorSession.objects.get(id=id)
        except MentorSession.DoesNotExist:
            return Response({'errors': 'This session does not exist.'}, status=400)

        session.delete()

        return Response(status=204)

class ViewsAppSessionView(APIView):
    permission_classes = [IsOwner]

    ### todo: SessionGroupID, Activity, VenueID are hardcoded need to be changed once admin page (creating mentor account) is completed

    def post(self, request):

        ############################
        # POST request for Session #
        ############################

        viewSessionData = '''<?xml version="1.0" encoding="utf-8"?>
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
                        </session>'''.format(3, request.data['StartDate'], request.data['StartTime'], request.data['Duration'], request.data['Cancelled'], 'Budgeting', request.data['LeadStaff'], 2)

        session_url = views_base_url + '3/sessions'
        try:
            response = requests.post(session_url, data = viewSessionData, headers = {"content-type": "text/xml"}, auth=(views_username, views_password))
            print("backend")
            sessionID = response.text[(response.text.find("<SessionID>")+ len("<SessionID>")):(response.text.find("</SessionID>"))]
            print(response.text)
            print(request.data)
            print(sessionID)
        except Exception as e:
            print(e)
            return Response({'Error':'Making a post request for session failed!'}, status=400)
        
        #################################
        # POST request for Session Note #
        #################################

        viewNoteData =  '''<?xml version="1.0" encoding="utf-8"?>
                            <notes>
                                <Note>{0}</Note>
                            </notes>'''.format(request.data['Notes'])
        note_url = views_base_url + 'sessions/' + sessionID + '/notes'
        print(note_url)
        try:
            response = requests.post(note_url, data = viewNoteData, headers = {"content-type": "text/xml"}, auth=(views_username, views_password))
            print(response.text)
        except Exception as e:
            print(e)
            return Response({'Error':'Making a post request for note failed!'}, status=400)

        ###########################
        # POST request for Mentor #
        ###########################

        viewMentorData =  '''<?xml version="1.0" encoding="utf-8"?>
                            <staff>
                                <ContactID>{0}</ContactID>
                                <Attended>{1}</Attended>
                                <Role>Lead</Role>
                                <Volunteering>Mentoring</Volunteering>
                            </staff>'''.format(request.data['LeadStaff'], request.data['Cancelled'])
        mentor_url = views_base_url + 'sessions/' + sessionID + '/staff'
        try:
            response = requests.post(mentor_url, data =  viewMentorData, headers = {"content-type": "text/xml"}, auth=(views_username, views_password))
            print(response.text)
        except Exception as e:
            print(e)
            return Response({'Error':'Making a post request for mentor failed!'}, status=400)

        ###########################
        # POST request for Mentee #
        ###########################
        viewMenteeData =  '''<?xml version="1.0" encoding="utf-8"?>
                            <participants>
                                <ContactID>{0}</ContactID>
                                <Attended>{1}</Attended>
                            </participants>'''.format(4,request.data['Cancelled'])
        mentee_url = views_base_url + 'sessions/' + sessionID + '/participants'
        try:
            response = requests.post(mentee_url, data =  viewMenteeData, headers = {"content-type": "text/xml"}, auth=(views_username, views_password))
            print(response.text)
        except Exception as e:
            print(e)
            return Response({'Error':'Making a post request for mentee failed!'}, status=400)

        return Response(response,status=200)
