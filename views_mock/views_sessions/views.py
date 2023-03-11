from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Session


# Create your views here.
class GetSingleSesion(APIView):
    def get(self, request, session_id, *args, **kwargs):
        session = Session.objects.get(pk=session_id)
        return Response(session)