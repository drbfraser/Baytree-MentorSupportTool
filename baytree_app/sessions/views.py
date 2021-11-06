from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MentorSession
from .serializers import SessionSerializer
from .permissions import *


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
