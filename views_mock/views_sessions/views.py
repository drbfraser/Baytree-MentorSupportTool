from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.serializers import ModelSerializer

from rest_framework_xml.renderers import XMLRenderer

from .models import Session


# Create your views here.
class GetSingleSession(APIView):
    authentication_classes = []
    permission_classes = []

    class SingleSessionRenderer(XMLRenderer):
        root_tag_name = "session"
        charset = "utf-8"

    class OutputSerializer(ModelSerializer):
        class Meta:
            model = Session
            fields = "__all__"

    def get_renderers(self):
        return [self.SingleSessionRenderer()]

    def get(self, request, session_id, *args, **kwargs):
        session = Session.objects.get(pk=session_id)
        output = self.OutputSerializer(session)
        return Response(output.data)