from rest_framework.views import APIView
from rest_framework.response import Response

from users.models import MentorUser
from .constants import views_base_url, views_username, views_password
from .permissions import *
import requests
import xmltodict
import json

class ViewsAppSessionView(APIView):
    permission_classes = [IsOwner]

    def get(self, request, id=None):

        mentorUser = MentorUser.objects.all().filter(user_id=id)

        all_volunteer_url = views_base_url + str(mentorUser[0].viewsPersonId)
    
        try:
            responseSession = requests.get(all_volunteer_url + '/sessions', 
                headers = {"content-type": "text/xml"},
                auth=(views_username, views_password))
            try:
                responseNote = requests.get(all_volunteer_url + '/notes', 
                    headers = {"content-type": "text/xml"},
                    auth=(views_username, views_password))
            except Exception as e:
                return Response({'errors': 'Request to viewsapp for notes failed'}, status=400) 

        except Exception as e:
            return Response({'errors': 'Request to viewsapp for session failed'}, status=400)       
        
        #turn the xml response to dictionary
        parsedSession = xmltodict.parse(responseSession.text)
        parsedNote = xmltodict.parse(responseNote.text)

        #Check to see if the mentor has zero sessions entered
        if(parsedSession["volunteer"]["sessions"] == None):
            volunteer = []
            jsonVolunteer = json.dumps(volunteer)
            return Response(jsonVolunteer,status=200)
        
        #sort throught the dictionary
        volunteerSessionList = parsedSession["volunteer"]["sessions"]["session"]
        volunteerNoteList = parsedNote["volunteer"]["notes"]["note"]

        #make json from dictionary
        volunteer = []
        for sessionDict in volunteerSessionList:
            for noteDict in volunteerNoteList:
                if sessionDict["SessionID"] == noteDict["TypeID"]:
                    volunteer.append({"SessionID":sessionDict["SessionID"],"Title": sessionDict["Title"],"StartDate": sessionDict["StartDate"],"Duration": sessionDict["Duration"],"Status": sessionDict["Status"],"Snippet": noteDict["Snippet"],"Note": noteDict["Note"]})
                       
        jsonVolunteer = json.dumps(volunteer)
        
        return Response(jsonVolunteer,status=200)


