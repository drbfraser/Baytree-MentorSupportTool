from rest_framework.views import APIView
from rest_framework.response import Response
from .constants import views_base_url, views_username, views_password
from .permissions import *
import requests
import xmltodict
import json

class ViewsAppSessionView(APIView):
    permission_classes = [IsOwner]

    def get(self, request, id=None):

        all_staff_url = views_base_url + str(id)
    
        try:
            responseSession = requests.get(all_staff_url + '/sessions', 
                headers = {"content-type": "text/xml"},
                auth=(views_username, views_password))
            try:
                responseNote = requests.get(all_staff_url + '/notes', 
                    headers = {"content-type": "text/xml"},
                    auth=(views_username, views_password))
            except Exception as e:
                return Response({'errors': 'Request to viewsapp for notes failed'}, status=400) 

        except Exception as e:
            return Response({'errors': 'Request to viewsapp for session failed'}, status=400)       
        
        #turn the xml response to dictionary
        parsedSession = xmltodict.parse(responseSession.text)
        parsedNote = xmltodict.parse(responseNote.text)
        
        #sort throught the dictionary
        staffSessionList = parsedSession["staff"]["sessions"]["session"]
        staffNoteList = parsedNote["staff"]["notes"]["note"]

        #make json from dictionary
        staff = []
        for sessionDict in staffSessionList:
            for noteDict in staffNoteList:
                if sessionDict["SessionID"] == noteDict["TypeID"]:
                    staff.append({"SessionID":sessionDict["SessionID"],"Title": sessionDict["Title"],"StartDate": sessionDict["StartDate"],"Duration": sessionDict["Duration"],"Status": sessionDict["Status"],"Snippet": noteDict["Snippet"],"Note": noteDict["Note"]})
                       
        jsonStaff = json.dumps(staff)
        
        return Response(jsonStaff,status=200)


