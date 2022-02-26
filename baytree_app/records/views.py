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

        ##TODO: GET THE ID
        all_staff_url = views_base_url + "1" 
        
        try:
            responseSession = requests.get(all_staff_url + '/sessions', 
                headers = {"content-type": "text/xml"},
                auth=(views_username, views_password))
            responseNote = requests.get(all_staff_url + '/notes', 
                headers = {"content-type": "text/xml"},
                auth=(views_username, views_password))
        except Exception as e:
            return Response({'errors': 'Request to viewsapp failed'}, status=400)       
        #print("hello")
        #print(responseNote.text)
        parsedSession = xmltodict.parse(responseSession.text)
        parsedNote = xmltodict.parse(responseNote.text)
        #print(parsedNote)

        staffSessionList = parsedSession["staff"]["sessions"]["session"]
        staffNoteList = parsedNote["staff"]["notes"]["note"]

        #print("hello")
        #print(staffNoteList[0]["Note"])


        staff = []
        for sessionDict in staffSessionList:
            for noteDict in staffNoteList:
                if sessionDict["SessionID"] == noteDict["TypeID"]:
                    staff.append({"SessionID":sessionDict["SessionID"],"Title": sessionDict["Title"],"StartDate": sessionDict["StartDate"],"Duration": sessionDict["Duration"],"Status": sessionDict["Status"],"Snippet": noteDict["Snippet"],"Note": noteDict["Note"]})
                
        #print([0]["SessionID"])
        #staff = {staffTranslateFields[i]: parsed["staff"]["sessions"]["session"][field] for i, field in enumerate(staffFields)}
        #return Response(staff,status=200)
        jsonStaff = json.dumps(staff)
        #print(jsonStaff)
        #print("hello")
        #print(staff)
        return Response(jsonStaff,status=200)


