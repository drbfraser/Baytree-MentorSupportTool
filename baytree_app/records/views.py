from rest_framework.views import APIView
from rest_framework.response import Response
from .constants import views_base_url, views_username, views_password
from .permissions import *
import requests
import xmltodict

class ViewsAppSessionView(APIView):
    permission_classes = [IsOwner]

    def get(self, request, id=None):

        all_staff_sessions_url = views_base_url + "contacts/staff/1"

        try:
            if id:
                try:
                    response = requests.get(all_staff_sessions_url + '/sessions', 
                    headers = {"content-type": "text/xml"},
                    auth=(username, password))
                    return Response(response,status=200)
                except Exception as e:
                    return Response({'errors': 'can not get sessions'}, status=400)
            else:
                 return Response({'errors': 'dont have id'}, status=400)
