from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import MentorSerializer
from .models import MentorUser

class MentorViews(APIView):

    def get(self, request, id=None):
        if id:
            item = MentorUser.objects.get(user_id=id)
            serializer = MentorSerializer(item)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

        items = MentorUser.objects.all()
        serializer = MentorSerializer(items, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)